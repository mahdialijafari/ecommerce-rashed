import Comment from "../Models/commentMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";

export const create = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({ ...req.body, userId: req.userId });
  return res.status(200).json({
    success: true,
    message: "comment crreated successfully",
    data: comment,
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const featires = new ApiFeatures(Comment, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const resData = await featires.execute();
  return res.status(200).json(resData);
});
export const getCommentsPoduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const featires = new ApiFeatures(Comment, req.query)
    .addManualFilters({ productId: id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate("userId");
  const resData = await featires.execute();
  return res.status(200).json(resData);
});
export const changeActivity = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  comment.isActive = !comment.isActive;
  const newComment = await comment.save();
  return res.status(200).json({
    success: true,
    message: "comment updated successfully",
    data: newComment,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Comment.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message: "comment removed successfully",
  });
});
export const reply = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findByIdAndUpdate(
    id,
    { reply: req?.body?.reply },
    { new: true }
  );
  return res.status(200).json({
    success: true,
    message: "add reply successfully",
    data: comment,
  });
});
