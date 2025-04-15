import Cart from "../Models/cartMd.js";
import DiscountCode from "../Models/disscountCodeMd.js";
import Order from "../Models/orderMd.js";
import ProductVariant from "../Models/productVariantMd.js";
import { ApiFeatures } from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { checkCode } from "./disscountCodeCn.js";

export const payment=catchAsync(async(req,res,next)=>{
    const {discountCode=null}=req.body
    const userId=req.userId
    const cart=await Cart.findOne({userId})
    let discount
    if(discountCode){
        let discountData=await DiscountCode.find({code:discountCode})
        const checkDiscount=checkCode(discountData,cart.totalPrice,userId)
        if(checkDiscount.success){
            return next(new HandleERROR(checkDiscount.error,400))
        }
        discount=discountData
    }
    let totalPrice=cart.totalPrice
    let change=false
    let newItems=[]
    let newTotalPrice=0
    for(let item of cart.items){
        let productVariant=await ProductVariant.findById(item.productVariantId)
        if(item.quantity>productVariant.quantity){
            item.quantity=productVariant.quantity
            change=true
        }
        if(productVariant.finalPrice != item.price){
            item.price=productVariant.finalPrice
            change=true
        }
        newTotalPrice+=item.price
        newItems.push(item)
    }
    if(change){
        cart.items=newItems
        cart.totalPrice=newTotalPrice
        const newCart=await cart.save()
        return res.status(400).json({
            message:'cart has been update',
            success:false,
            data:newCart
        })
    }
})
export const getAll=catchAsync(async(req,res,next)=>{
    const featires = new ApiFeatures(Order, req.query, req?.role)
    .addManualFilters(
      req.role !== "admin" && req.role !== "superAdmin"
        ? { userId: req.userId }
        : null
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const resData = await featires.execute();
  return res.status(200).json(resData);

})
export const getOne=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const userId=req.userId
    const order=await Order.findOne({_id:id,userId}).populate(req?.query?.populate)
    return res.status(200).json({
        status: "success",
        data: order
    })
})
export const checkPayment=catchAsync(async(req,res,next)=>{
    
})
