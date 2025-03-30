import User from "../Models/userMd.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { sendAuthCode, verifyCode } from "../Utils/smsHandler.js";
import bcryptjs from "bcryptjs";


const generateToken=(user)=>{
  const token=jwt.sign({id:user._id,role:user?.role},process.env.JWT_SECRET)
  return token
}

export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) {
    return next(new HandleERROR("phone number is required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  const passwordExist = user?.password ? true : false;
  if (!passwordExist) {
    const smsResult = await sendAuthCode(phoneNumber);
    if (!smsResult?.success) {
      return next(new HandleERROR("try again", 400));
    }
  }
  return res.status(200).json({
      success: true,
      message: passwordExist ? "login with password" : "send code",
      data: {
        phoneNumber,
        passwordExist,
        newAccount: !user?._id,
      },
    });
});

export const checkOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, code = null } = req.body;
  if (!phoneNumber || !code) {
    return next(new HandleERROR("phone number and code are required", 400));
  }
  const resultSms=await verifyCode(phoneNumber,code)
  if(!resultSms?.success){
    return next(new HandleERROR("invalid code", 400));
  }
  let user = await User.findOne({ phoneNumber });
  let isNewAccount=false
  if (!user) {
    user = await User.create({ phoneNumber });
    isNewAccount=true
  } 
  const token=generateToken(user)
  return res.status(200).json({
    success: true,
    message: "login successful",
    data: {
      user:{
        _id:user._id,
        phoneNumber:user.phoneNumber,
        role:user.role,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        favoriteProducts:user.favoriteProductIds,
        firstName:user.firstName||'',
        lastName:user.lastName||'',
        birthDate:user.birthDate||'',
      },
      token,
    },
  });
});

export const checkPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, password = null } = req.body;
  if (!phoneNumber || !password) {
    return next(new HandleERROR("phone number and password are required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user || !user?.password) {
    return next(new HandleERROR("user not found or password not exist", 400));
  }
  const isCorrectPassword = bcryptjs.compareSync(password, user?.password);
  if (!isCorrectPassword) {
    return next(new HandleERROR("invalid password", 400));
  }
  const token=generateToken(user)
  return res.status(200).json({
    success: true,
    message: "login successful",
    data: {
      user:{
        _id:user._id,
        phoneNumber:user?.phoneNumber,
        role:user?.role,
        createdAt:user?.createdAt,
        updatedAt:user?.updatedAt,
        favoriteProducts:user?.favoriteProductIds,
        firstName:user?.firstName||'',
        lastName:user?.lastName||'',
        birthDate:user?.birthDate||'',
      },
      token,
    },
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber = null,code=null,newPassword=null } = req.body;
  if (!phoneNumber||!code||!newPassword) {
    return next(new HandleERROR("phone number, code and password is required", 400));
  }
  const resultSms=await verifyCode(phoneNumber,code)
  if(!resultSms?.success){
    return next(new HandleERROR("invalid code", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("user not found", 400));
  }
  const handlePassword=await bcryptjs.hash(newPassword,10)
  user.password=handlePassword
  await user.save()
  const token=generateToken(user)
  return res.status(200).json({
    success: true,
    message: "password changed successfully",
    data: {
      user:{
        _id:user._id,
        phoneNumber:user?.phoneNumber,
        role:user?.role,
        createdAt:user?.createdAt,
        updatedAt:user?.updatedAt,
        favoriteProducts:user?.favoriteProductIds,
        firstName:user?.firstName||'',
        lastName:user?.lastName||'',
        birthDate:user?.birthDate||'',
      },
      token,
    },
  });
});

export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) {
    return next(new HandleERROR("phone number is required", 400));
  }
  const smsResult = await sendAuthCode(phoneNumber);
  if (!smsResult?.success) {
    return next(new HandleERROR("try again", 400));
  }
  return res.status(200).json({
    success: true,
    message: "code sent successfully",
  });
});