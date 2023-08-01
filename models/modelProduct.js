const mongoose = require('mongoose');
 
const ProductSchema = new mongoose.Schema({
  masp: {
    type: String,
    
  },
  tensp: {
    type: String,
   
  },
  loaisp: {
    type: String,
    
  },
  price:{
    type: Number,
    
  },
  image: {
    type: String,
    
  },
  color:{
    type: String,
   
  }
});

const Product = mongoose.model('tbProduct', ProductSchema);
module.exports = Product;