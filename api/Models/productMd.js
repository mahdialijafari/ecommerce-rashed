import mongoose from "mongoose";

const informationSchema=new mongoose.Schema({
    name:String,
    value:String
},{_id:false})
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim:true
    },
    description:{
        type:String,
        require:[true,'description is required'],
        trim:true
    },
    information:{
        type:[informationSchema],
        default:[]
    },
    images:{
        type:[String],
        default:[]
    },
    categoryIds:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'category'
        }],
        default:[]
    },
    brandId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true,'category is required']
    },
    isActive:{
        type:Boolean,
        default:true
    },
    defaultProductVariant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'productVariant',
    }
},{timestamps:true})

const Product=mongoose.model("Product",productSchema);
export default Product