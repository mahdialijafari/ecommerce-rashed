import mongoose from "mongoose";


const variantSchema=new mongoose.Schema({
    price:{
        type:Number,
        required:[true,'price is required'],
    },
    finalPrice:{
        type:Number,
        required:[true,'final price is required'],
    },
    quantity:{
        type:Number,
        required:[true,'quantity is required'],
    },
    variantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Variant',
        required:[true,'variant is required'],
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:[true,'product is required'],
    },
    disscount:{
        type:Number,
        required:[true,'disscount is required'],
        default:0,
        min:0,
        max:100,
    },
    isActive:{
        type:Boolean,
        default:true,
    },

},{timestamps:true})

const ProductVariant=mongoose.model("ProductVariant",variantSchema);
export default ProductVariant