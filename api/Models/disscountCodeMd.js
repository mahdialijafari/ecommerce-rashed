import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "discount code is required"],
  },
  percent: {
    type: Number,
    required: [true, "percent is required"],
    min:1,
    max:100,
  },
  userIdUsed:{
    type:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      }
    ],
    default:[]
  },
  expireTime:{
    type:Date,
    required: [true, "expire time code is required"],
  },
  startTime:{
    type:Date,
    required: [true, "start time code is required"],
  },
  isActive:{
    type:Boolean,
    default:true
  },
  useCount:{
    type:Number,
    default:1
  },
  maxPrice:{
    type:Number,
  },
  minPrice:{
    type:Number,
  },
},{timestamps:true});


const DiscountCode=mongoose.model("DiscountCode",discountCodeSchema)
export default DiscountCode