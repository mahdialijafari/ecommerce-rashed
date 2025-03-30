import ProductVariant from "../Models/productVariantMd.js";
import catchAsync from "../Utils/catchAsync.js";

export const create=catchAsync(async(req,res,next)=>{

})
export const getAll=catchAsync(async(req,res,next)=>{
    
})
export const getOne=catchAsync(async(req,res,next)=>{
    
})
export const update=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const productVariant=await ProductVariant.findByIdAndUpdate(id,req.body,{new:true})
    return res.status(200).json({
        success:true,
        data:productVariant,
        message:"Product Variant Updated Successfully"
    })
})
export const remove=catchAsync(async(req,res,next)=>{
    
})