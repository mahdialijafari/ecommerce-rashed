import Slider from "../Models/sliderMd.js";
import Product from "../Models/productMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";

export const create = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);
  res.status(200).json({
    success: true,
    data: slider,
    message: "create slider successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Slider, req?.quary)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate()
  const sliders = await features.query;
  const count = await Slider.countDocuments(req?.quary?.filter);
  res.status(200).json({
    success: true,
    data: sliders,
    count,
  });
});


export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.find({ sliderId: id });
  if (products) {
    return next(
      new HandleERROR("please remove product of this slider first", 400)
    );
  }
  const slider = await Slider.findByIdAndDelete(id);
  fs.unlinkSync(`${__dirname}/Public/${slider.image}`);
  res.status(200).json({
    success: true,
    meesage: "remove slider successfully",
  });
});
