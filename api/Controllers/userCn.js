import catchAsync from "../Utils/catchAsync.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import User from "../Models/userMd.js";
import HandleERROR from "../Utils/handleError.js";

export const getAll=catchAsync(async(req,res,next)=>{
    const features=new ApiFeatures(User,req?.quary).filter().sort().limitFields().paginate().populate()
    const users=await features.query;
    const count=await User.countDocuments(req?.quary?.filter)
    res.status(200).json({
        success:true,
        data:users,
        count,
    })
})
export const getOne=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    if(id!=req.userId&&req.role!='admin'&&req.role!='superAdmin'){
        return next(new HandleERROR("you don't have a permission",401))
    }
    const user=await User.findById(id)
    res.status(200).json({
        success:true,
        data:user,
    })
})
export const update=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const {role=null,phoneNumber=null,boughtProductIds=null,...others}=req.body
    if(id!=req.userId&&req.role!='admin'&&req.role!='superAdmin'){
        return next(new HandleERROR("you don't have a permission",401))
    }
    const user=await User.findByIdAndUpdate(id,others,{nwe:true})
    res.status(200).json({
        success:true,
        data:user,
    })
})
