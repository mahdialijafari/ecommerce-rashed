import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productVariantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
  },
  categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  quantity:{
    type: Number,
    default:1
  }
},{_id:false});


const cartSchema = new mongoose.Schema({
  items:{
    type:[itemSchema],
    default:[]
  },
  totalPrice:{
    default:0,
    type:Number
  }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
