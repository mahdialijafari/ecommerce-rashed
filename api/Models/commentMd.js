import mongoose, { Schema,model } from "mongoose";
const commentSchema=new Schema({
    content:{
        type:String,
        required:true,
        trim:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    isActive:{
        type:Boolean,
        default:false
    },
    reply:{
        type:String,
    },
},{timestamps:true})

const Comment=model('Comment',commentSchema)
export default Comment