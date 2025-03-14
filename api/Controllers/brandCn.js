import Brand from "../Models/brandMd.js";
import Product from "../Models/productMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";

export const create = catchAsync(async (req, res, next) => {
  const brand = await Brand.create(req.body);
  res.status(200).json({
    success: true,
    data: brand,
    message: "create brand successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Brand, req?.quary)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate()
  const brands = await features.query;
  const count = await Brand.countDocuments(req?.quary?.filter);
  res.status(200).json({
    success: true,
    data: brands,
    count,
  });
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id)
  res.status(200).json({
    success: true,
    data: brand,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    data: brand,
    meesage: "update brand successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.find({ brandId: id });
  if (products) {
    return next(
      new HandleERROR("please remove product of this brand first", 400)
    );
  }
  const brand = await Brand.findByIdAndDelete(id);
  fs.unlinkSync(`${__dirname}/Public/${brand.image}`);
  res.status(200).json({
    success: true,
    meesage: "remove brand successfully",
  });
});
