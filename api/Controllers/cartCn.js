import Cart from "../Models/cartMd.js";
import ProductVariant from "../Models/productVariantMd.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

export const add=catchAsync(async(req,res,next)=>{
    const {productVariantId=null,categoryId=null,productId=null}=req.body
    if(!productId || !productVariantId || !categoryId){
        return next(new HandleERROR('bad request',400))
    }
    const userId=req.userId
    const cart=await Cart.findOne({userId})
    const productVariant=await ProductVariant.findById(productVariantId)
    let add=false
    cart.items=cart.items?.map((e)=>{
        if(productVariantId==e.productVariantId){
            if(!productVariant.quantity<e.quantity){
                return next(new HandleERROR('not enough product to add to cart',400))
            }
            add=true
            e.quantity++
            cart.totalPrice+=productVariant.finalPrice
        }
        return true
    })
    if(!add){

        cart.items.push({productVariantId,quantity:1})
    }
})
export const remove=catchAsync(async(req,res,next)=>{
    const {productVariantId=null}=req.body
    const cart=await Cart.findOne({userId:req.userId})
    cart.items=cart.items.filter(item=>{
        if(productVariantId==item._id){
            item.quantity--
            cart.totalPrice-=item.price
            if(item.quantity==0){
                return false
            }
        }
        return true
    })
    await cart.save()
    return res.status(200).json({
        success:true,
        data:cart,
        message:'cart updated'
    })
})
export const clear=catchAsync(async(req,res,next)=>{
    const cart=await Cart.findOneAndUpdate({userId:req.userId},{totalPrice:0,items:[]})
    return res.status(200).json({
        success:true,
        data:cart,
        message:'cart is clear'
    })
})
export const getOne=catchAsync(async(req,res,next)=>{
    const userId=req.userId
    const cart=await Cart.findOne({userId})
    return res.status(200).json({
        success:true,
        data:cart,
    })
})