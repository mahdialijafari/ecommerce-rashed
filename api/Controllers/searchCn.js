import Brand from "../Models/brandMd.js";
import Category from "../Models/categoryMd.js";
import Product from "../Models/productMd.js";
import catchAsync from "../Utils/catchAsync.js";

export const search=catchAsync(async(req,res,next)=>{
    const {query}=req.body
    const products=await Product.find({name:{$regex:query,$options:'i'}}).skip(0).limit(10)
    const categories=await Category.find({title:{$regex:query,$options:'i'}}).skip(0).limit(10)
    const brands=await Brand.find({title:{$regex:query,$options:'i'}}).skip(0).limit(10)
    res.status(200).json({
        success:true,
        data:{
            products,
            categories,
            brands
        }
    })
})