const mongoose = require('mongoose');
 
const ProductSchema = new mongoose.Schema({
  masp: {
    type: String,
    required: true
  },
  tensp: {
    type: String,
    required: true
  },
  loaisp: {
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  color:{
    type: String,
    required: true
  }
});

const Product = mongoose.model('tbProduct', ProductSchema);
module.exports = Product;