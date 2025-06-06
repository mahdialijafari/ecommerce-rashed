import DiscountCode from "../Models/disscountCodeMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

export const checkCode = (discount, totalPrice, userId) => {
  const now = new Date.now();
  const exTime = discount.expireTime.getTime();
  const stTime = discount.startTime.getTime();
  const userUsedCount =
    discount.userIdUsed?.filter((e) => e.toString() === userId.toString())
      .length || 0;
  let err;
  if (!discount.isActive) {
    err = "discount code is not active";
  } else if (stTime > now) {
    err = "discount code is not started";
  } else if (exTime < now) {
    err = "discount code is expired";
  } else if (userUsedCount >= discount.usedCount) {
    err = "discount code is already used";
  } else if (discount.minPrice > totalPrice || discount.maxPrice < totalPrice) {
    err = "discount code is not started";
  } else if (stTime > now) {
    err = "discount code is not valid for this price";
  }
  return { success: !err, error: err };
};

export const create = catchAsync(async (req, res, next) => {
  const discount = await DiscountCode.create(req.body);
  return res.status(200).json({
    success: true,
    message: "discount created successfully",
    data: discount,
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.quary, req?.role)
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
  const discount = await DiscountCode.findById(id);
  return res.status(200).json({
    success: true,
    data: discount,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const discount = await DiscountCode.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: discount,
    message: "discount upadted successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const discount = await DiscountCode.findById(id);
  if (discount.userIdUsed.length > 0) {
    return next(
      new HandleERROR("you can't remove this code, already used", 400)
    );
  }
  await DiscountCode.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message: "discount removed successfully",
  });
});
export const check = catchAsync(async (req, res, next) => {
  const { code = null, totalPrice = null } = req.body;
  if (!code || !totalPrice) {
    return next(new HandleERROR("code and total price are required"));
  }
  const discount = await DiscountCode.findOne({ code });
  const checking = checkCode(discount, totalPrice, req.userId);
  if (!checking.success) {
    return next(new HandleERROR(checkCode.error, 400));
  }
  return res.status(200).json({
    success: true,
    message: "discount code is valid",
    data: {
        percent:discount.percent,
        priceAfterDiscount:totalPrice * (1-discount.percent/100),
        code,
        totalPrice,
    },
  });
});
