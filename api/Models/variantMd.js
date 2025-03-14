import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "type is required"],
    enum: ["color", "size"],
  },
  value: {
    type: String,
    required: [true, "value is required"],
  },
},{timestamps:true});


const Variant=mongoose.model("Variant",variantSchema)
export default Variant