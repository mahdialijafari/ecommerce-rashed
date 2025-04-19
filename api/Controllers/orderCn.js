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

export const payment = catchAsync(async (req, res, next) => {
  const { discountCode = null, addressId = null } = req.body;
  const userId = req.userId;
  const objectUserId=mongoose.Types.ObjectId(userId)
  const cart = await Cart.findOne({ userId });

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
    // Unwind the product array returned by the lookup.
    { $unwind: { path: "$items.product", preserveNullAndEmptyArrays: true } },

    // 4. Lookup the ProductVariant document for each item.
    {
      $lookup: {
        from: "ProductVariant", // Adjust as necessary.
        localField: "items.productVariantId",
        foreignField: "_id",
        as: "items.productVariant"
      }
    },
    { $unwind: { path: "$items.productVariant", preserveNullAndEmptyArrays: true } },

    // 5. Lookup the Category document for each item.
    {
      $lookup: {
        from: "Category", // Adjust as necessary.
        localField: "items.categoryId",
        foreignField: "_id",
        as: "items.category"
      }
    },
    { $unwind: { path: "$items.category", preserveNullAndEmptyArrays: true } },

    // 6. Group the individual items back into the cart.
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        items: { $push: "$items" }
      }
    }
  ]);


  let listOfProductId = [];
  let discount;
  if (addressId) {
    return next(new HandleERROR("address required", 400));
  }
  if (discountCode) {
    let discountData = await DiscountCode.findOne({ code: discountCode });
    const checkDiscount = checkCode(discountData, cart.totalPrice, userId);
    if (!checkDiscount.success || !discountData) {
      return next(new HandleERROR(checkDiscount?.error, 400));
    }
    discount = discountData;
  }
  let totalPrice = cart.totalPrice;
  let change = false;
  let newItems = [];
  let newTotalPrice = 0;
  for (let item of cart.items) {
    listOfProductId.push(item.productId);
    let productVariant = await ProductVariant.findById(item.productVariantId);
    if (item.quantity > productVariant.quantity) {
      item.quantity = productVariant.quantity;
      change = true;
    }
    if (productVariant.finalPrice != item.price) {
      item.price = productVariant.finalPrice;
      change = true;
    }
    newTotalPrice += item.price;
    newItems.push(item);
  }
  if (change) {
    cart.items = newItems;
    cart.totalPrice = newTotalPrice;
    const newCart = await cart.save();
    return res.status(400).json({
      message: "cart has been update",
      success: false,
      data: newCart,
    });
  }
  let percent;
  if (discount) {
    percent = discount.percent;
  }
  let totalPriceAfterDiscount = percent
    ? newTotalPrice * (1 - percent / 100)
    : newTotalPrice;
  // zarinpal request
  const responseZarinpal = 100;
  if (responseZarinpal != 100) {
    return next(new HandleERROR("payment gateway not response", 500));
  }
  const authority = "00000000000000000844574684348";
  const paymentGateway = "from zarinpal request";
  const order = await Order.create({
    totalPrice: newTotalPrice,
    totalPriceAfterDiscount,
    userId,
    addressId,
    discountId: discount?._id,
    authority,
    items:aggregatedCart?.items
  });
  const user=await User.findById(userId)
  user.boughtProductIds=[...user.boughtProductIds,...listOfProductId]
  await user.save()
  if(discount?._id){
    await DiscountCode.findOneAndUpdate({code:discountCode},{$pull:{userIdUsed:userId}})
  }
  cart.items=[]
  cart.totalPrice=0
  await cart.save()
  return res.status(200).json({
    success:true,
    data:{paymentGateway}
  })
});
export const getAll = catchAsync(async (req, res, next) => {
  const featires = new ApiFeatures(Order, req.query, req?.role)
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
  const resData = await featires.execute();
  return res.status(200).json(resData);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;
  const order = await Order.findOne({ _id: id, userId }).populate(
    req?.query?.populate
  );
  return res.status(200).json({
    status: "success",
    data: order,
  });
});
export const checkPayment = catchAsync(async (req, res, next) => {});
