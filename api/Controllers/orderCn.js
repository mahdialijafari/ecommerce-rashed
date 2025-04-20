import mongoose from "mongoose";
import Cart from "../Models/cartMd.js";
import DiscountCode from "../Models/disscountCodeMd.js";
import Order from "../Models/orderMd.js";
import ProductVariant from "../Models/productVariantMd.js";
import { ApiFeatures } from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { checkCode } from "./disscountCodeCn.js";
import User from "../Models/userMd.js";

// Mock Zarinpal verification function
const verifyZarinpal = async (authority) => {
  if (authority === "valid-authority") {
    return { success: true };
  } else {
    return { success: false };
  }
};

export const payment = catchAsync(async (req, res, next) => {
  const { discountCode = null, addressId = null } = req.body;
  const userId = req.userId;
  const objectUserId = mongoose.Types.ObjectId(userId);

  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    return next(new HandleERROR("Cart is empty", 400));
  }

  const aggregatedCart = await Cart.aggregate([
    { $match: { userId: objectUserId } },
    { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "Product",
        localField: "items.productId",
        foreignField: "_id",
        as: "items.product"
      }
    },
    { $unwind: { path: "$items.product", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "ProductVariant",
        localField: "items.productVariantId",
        foreignField: "_id",
        as: "items.productVariant"
      }
    },
    { $unwind: { path: "$items.productVariant", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "Category",
        localField: "items.categoryId",
        foreignField: "_id",
        as: "items.category"
      }
    },
    { $unwind: { path: "$items.category", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        items: { $push: "$items" }
      }
    }
  ]);

  if (!addressId) {
    return next(new HandleERROR("Address is required", 400));
  }

  let discount;
  if (discountCode) {
    const discountData = await DiscountCode.findOne({ code: discountCode });
    const checkDiscount = checkCode(discountData, cart.totalPrice, userId);
    if (!checkDiscount.success || !discountData) {
      return next(new HandleERROR(checkDiscount?.error || "Invalid discount code", 400));
    }
    discount = discountData;
  }

  let listOfProductId = [];
  let totalPrice = cart.totalPrice;
  let change = false;
  let newItems = [];
  let newTotalPrice = 0;

  for (let item of cart.items) {
    listOfProductId.push(item.productId);
    const productVariant = await ProductVariant.findById(item.productVariantId);
    if (!productVariant) {
      return next(new HandleERROR("Product variant not found", 400));
    }
    if (item.quantity > productVariant.quantity) {
      item.quantity = productVariant.quantity;
      change = true;
    }
    if (productVariant.finalPrice !== item.price) {
      item.price = productVariant.finalPrice;
      change = true;
    }
    newTotalPrice += item.price * item.quantity;
    newItems.push(item);
  }

  if (change) {
    cart.items = newItems;
    cart.totalPrice = newTotalPrice;
    const newCart = await cart.save();
    return next(new HandleERROR("Cart has been updated, please try again", 400));
  }

  let percent;
  if (discount) {
    percent = discount.percent;
  }

  const totalPriceAfterDiscount = percent
    ? newTotalPrice * (1 - percent / 100)
    : newTotalPrice;

  const responseZarinpal = 100;
  if (responseZarinpal !== 100) {
    return next(new HandleERROR("Payment gateway not responding", 500));
  }

  const authority = "valid-authority";
  const paymentGateway = "from zarinpal mock request";

  const order = await Order.create({
    totalPrice: newTotalPrice,
    totalPriceAfterDiscount,
    userId,
    addressId,
    discountId: discount?._id,
    authority,
    items: aggregatedCart[0]?.items,
    paymentStatus: "pending"
  });

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleERROR("User not found", 400));
  }
  user.boughtProductIds = [...user.boughtProductIds, ...listOfProductId];
  await user.save();

  if (discount?._id) {
    await DiscountCode.findOneAndUpdate({ code: discountCode }, { $pull: { userIdUsed: userId } });
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return res.status(200).json({
    success: true,
    data: { paymentGateway }
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Order, req.query, req?.role)
    .addManualFilters(
      req.role !== "admin" && req.role !== "superAdmin"
        ? { userId: req.userId }
        : null
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const resData = await features.execute();
  return res.status(200).json(resData);
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  const order = await Order.findOne({ _id: id, userId }).populate(req?.query?.populate);
  if (!order) {
    return next(new HandleERROR("Order not found", 404));
  }

  return res.status(200).json({
    status: "success",
    data: order,
  });
});

export const checkPayment = catchAsync(async (req, res, next) => {
  const { authority } = req.body;
  const userId = req.userId;

  if (!authority) {
    return next(new HandleERROR("Authority is required", 400));
  }

  const order = await Order.findOne({ authority, userId });
  if (!order) {
    return next(new HandleERROR("Order not found", 404));
  }

  if (order.paymentStatus !== "pending") {
    return next(new HandleERROR("Payment already checked", 400));
  }

  const result = await verifyZarinpal(authority);

  if (result.success) {
    order.paymentStatus = "success";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });
  } else {
    order.paymentStatus = "failed";
    await order.save();

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items.push(...order.items);
      cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await cart.save();
    }

    if (order.discountId) {
      await DiscountCode.findByIdAndUpdate(order.discountId, { $push: { userIdUsed: userId } });
    }

    const user = await User.findById(userId);
    if (user) {
      user.boughtProductIds = user.boughtProductIds.filter(
        id => !order.items.find(item => item.productId.toString() === id.toString())
      );
      await user.save();
    }

    for (const item of order.items) {
      await ProductVariant.findByIdAndUpdate(item.productVariantId, {
        $inc: { quantity: item.quantity }
      });
    }

    return next(new HandleERROR("Payment failed and cart restored", 400));
  }
});

export const checkPendingOrders = catchAsync(async (req, res, next) => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const pendingOrders = await Order.find({
    paymentStatus: "pending",
    createdAt: { $lte: tenMinutesAgo }
  });

  for (const order of pendingOrders) {
    const result = await verifyZarinpal(order.authority);

    if (result.success) {
      order.paymentStatus = "success";
      await order.save();
    } else {
      order.paymentStatus = "failed";
      await order.save();

      const userId = order.userId;

      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items.push(...order.items);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await cart.save();
      }

      if (order.discountId) {
        await DiscountCode.findByIdAndUpdate(order.discountId, { $push: { userIdUsed: userId } });
      }

      const user = await User.findById(userId);
      if (user) {
        user.boughtProductIds = user.boughtProductIds.filter(
          id => !order.items.find(item => item.productId.toString() === id.toString())
        );
        await user.save();
      }

      for (const item of order.items) {
        await ProductVariant.findByIdAndUpdate(item.productVariantId, {
          $inc: { quantity: item.quantity }
        });
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: `${pendingOrders.length} pending orders checked`
  });
});
