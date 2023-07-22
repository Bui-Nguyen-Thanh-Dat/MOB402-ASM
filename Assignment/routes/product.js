const express = require('express');
const router = express.Router();
const Product = require('../models/modelProduct');
    
   router.get('/data', async (req, res) => {
     try {
       const data = await Product.find();

       res.json(data);
     } catch (error) {
       console.error('Lỗi lấy dữ liệu:', error);
       res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
     }
   });
module.exports = router;