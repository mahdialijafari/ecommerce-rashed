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
        required:[true,'variantId is required'],
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true,'productId is required'],
    },
    disscount:{
        type:Number,
        required:[true,'disscount is required'],
    },
    
},{timestamps:true})

const ProductVariant=mongoose.model("ProductVariant",variantSchema);
export default ProductVariant