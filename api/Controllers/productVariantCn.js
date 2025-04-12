import ProductVariant from "../Models/productVariantMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";

export const create=catchAsync(async(req,res,next)=>{
    const produvtVariant=await ProductVariant.create(req.body)
    return res.status(201).json({
        success:true,
        data:produvtVariant,
        message:"Product Variant Created Successfully"
    })
})

export const getAll=catchAsync(async(req,res,next)=>{
    const featires = new ApiFeatures(ProductVariant, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate('productId variantId')
  const resData = await featires.execute();
  return res.status(200).json(resData);
})

export const getOne=catchAsync(async(req,res,next)=>{
    const { id } = req.params;
    const productVariant = await ProductVariant.findById(id).populate("productId variantId");
    return res.status(200).json({
        success:true,
        data:productVariant,
    })
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
    const {id}=req.params
    const productVariant=await ProductVariant.findByIdAndDelete(id)
    return res.status(200).json({
        success:true,
        message:"Product Variant removed Successfully"
    })
})