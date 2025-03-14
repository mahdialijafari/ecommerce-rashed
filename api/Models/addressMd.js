import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "city is required"],
  },
  state: {
    type: String,
    required: [true, "state is required"],
  },
  street: {
    type: String,
    required: [true, "street is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  receivreName: {
    type: String,
    required: [true, "receivreName is required"],
  },
  receivrePhone: {
    type: String,
    required: [true, "receivrePhone is required"],
  },
  postalCode: {
    type: String,
    required: [true, "postalCode is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
},{timestamps:true});


const Address=mongoose.model("Address",addressSchema)
export default Address