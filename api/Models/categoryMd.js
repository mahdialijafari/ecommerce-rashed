import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  parentCategoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
},{timestamps:true});


const Category=mongoose.model("Category",categorySchema)
export default Category