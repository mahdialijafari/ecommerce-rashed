import Variant from "../Models/variantMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";

export const create = catchAsync(async (req, res, next) => {
  const variant = await Variant.create(req.body);
  res.status(200).json({
    success: true,
    data: variant,
    message: "create variant successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const featires = new ApiFeatures(Variant, req.query,req.role)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .populate()
    const resData = await featires.execute();
    return res.status(200).json(resData);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const variant = await Variant.findById(id);
  res.status(200).json({
    success: true,
    data: variant,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const variant = await Variant.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    success: true,
    data: variant,
    meesage: "update variant successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Variant.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    meesage: "remove variant successfully",
  });
});
