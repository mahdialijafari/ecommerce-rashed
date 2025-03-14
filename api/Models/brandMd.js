import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
},{timestamps:true});


const Brand=mongoose.model("Brand",brandSchema)
export default Brand