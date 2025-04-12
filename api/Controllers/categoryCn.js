import Category from "../Models/categoryMd.js";
import Product from "../Models/productMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";

export const create = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  return res.status(200).json({
    success: true,
    data: category,
    message: "create category successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
    const featires = new ApiFeatures(Category, req.query,req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate('parentCategoryId')
  const resData = await featires.execute();
  return res.status(200).json(resData);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("parentCategoryId");
  res.status(200).json({
    success: true,
    data: category,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    data: category,
    meesage: "update category successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.find({ categoryId: id });
  if (products) {
    return next(
      new HandleERROR("please remove product of this category first", 400)
    );
  }
  const category = await Category.findByIdAndDelete(id);
  fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  res.status(200).json({
    success: true,
    meesage: "remove category successfully",
  });
});
