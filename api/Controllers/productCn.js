import Product from "../Models/productMd";
import catchAsync from "../Utils/catchAsync";

export const create=catchAsync(async(req,res,next)=>{
    const product=await Product.create({...req.body,userId:req.userId})
        return res.status(200).json({
            success:true,
            data:product,
            message:'product address successfully'
        })
})
export const getAll=catchAsync(async(req,res,next)=>{
    
})
export const getOne=catchAsync(async(req,res,next)=>{
    
})
export const update=catchAsync(async(req,res,next)=>{
    
})
export const remove=catchAsync(async(req,res,next)=>{
    
})