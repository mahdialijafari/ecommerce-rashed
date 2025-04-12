import catchAsync from "../Utils/catchAsync.js";
import Rate from "../Models/RateMd.js";
import User from "../Models/userMd.js";
import HandleERROR from "../Utils/handleError.js";

export const create = catchAsync(async (req, res, next) => {
    const {productId=null,...others}=req.body
    const user=await User.findById(req.userId)
    if(user.boughtProductIds.includes(productId)){
        return next(new HandleERROR('you can not rate this product',400))
    }
  const rate = await Rate.findOne({productId});
  if(rate.userIds.includes(req.userId)){
    return next(new HandleERROR('you have rated this product',400))
}
rate.userId.push(req.userId)
let rtCount=rate.rateCount
let totalRate=rtCount*rate.rate+req.body.rate
rate.rate=totalRate/(rtCount+1)
rate.rateCount=rate.rateCount+1
const newRate=await rate.save()
  return res.status(200).json({
    success: true,
    data: category,
    message: "rated successfully",
  });
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("parentCategoryId");
  res.status(200).json({
    success: true,
    data: category,
  });
});
