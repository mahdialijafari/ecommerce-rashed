import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
},{timestamps:true});


const DiscountCode=mongoose.model("DiscountCode",discountCodeSchema)
export default DiscountCode