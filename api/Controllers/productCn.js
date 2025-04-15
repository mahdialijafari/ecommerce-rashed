import Product from "../Models/productMd.js";
import User from "../Models/userMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { __dirname } from "../app.js";
import jwt from "jsonwebtoken";

export const create = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  const rt = await Rate.create({ productId: product._id });
  const newpr = await Product.findByIdAndUpdate(product._id, {
    rateId: rt._id,
  });
  res.status(200).json({
    success: true,
    data: newpr,
    message: "create product successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  let role = null;
  if (req.headers?.authorization.split(" ")[1]) {
    role = jwt.verify(
      req.headers?.authorization.split(" ")[1],
      process.env.SECRET_JWT
    ).role;
  }

  const featires = new ApiFeatures(Product, req.query, role)

    .addManualFilters(
      role != "admin" && role != "superAdmin" ? { isActive: true } : null
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate("categoryIds brandId defaultProductVariant rateId");
  const resData = await featires.execute();
  return res.status(200).json(resData);
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate(
    "categoryIds brandId defaultProductVariant rateId"
  );
  let favoriteProduct = false;
  if (req.headers?.authorization.split(" ")[1]) {
    const { id: userId, role } = jwt.verify(
      req.headers?.authorization.split(" ")[1],
      process.env.SECRET_JWT
    );
    if (role != "admin" && role != "superAdmin" && !product.isActive) {
      return next(new HandleERROR("product is not available", 400));
    }
    const user = await User.findById(userId);
    const fav = user?.favoriteProductIds?.find((e) => e == id);
    if (fav) {
      favoriteProduct = true;
    }
  }
  res.status(200).json({
    success: true,
    data: product,
    favoriteProduct,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    success: true,
    data: product,
    meesage: "update product successfully",
  });
});
