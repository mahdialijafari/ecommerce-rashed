import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:String,
  phoneNumber: {
    type: String,
    match:[],
    required: [true, "phone number is required"],
    unique: [true, "phone number already taken"],    
  },
  favoriteProduct: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    default: []
  },
  boughtProductIds: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    default: []
  },
  password:{
    type:String,
  },
  role:{
    type:String,
    enum:['user','admin','superAdmin'],
    default:'user'
  }
},{timestamps:true});


const User=mongoose.model("User",userSchema)
export default User