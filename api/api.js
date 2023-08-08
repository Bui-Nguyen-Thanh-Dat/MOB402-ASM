var express=require('express');
var router=express.Router();
var app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Product=require('../models/modelProduct');
const User=require('../models/modelUser');

const uri='mongodb+srv://datbntph19949:thanhdat12345@cluster0.nbfpjmg.mongodb.net/dbProduct';

router.get('/', async (req, res) => {

    await mongoose.connect(uri);
  
    console.log('Ket noi db thanh cong!')
  
    let product = await Product.find();
    res.send(product);
  })

router.get('/addproduct', async (req, res) => {
    await mongoose.connect(uri);

  arrNew = [];

  let sp1= {
    masp:2,
    tensp: "Asus vivobook Pro 15",
    loaisp: "laptop",
    price:18000000,
    image:"",
    color: "Bạc"
  };

  arrNew.push(sp1);

  let kq = await Product.collection.insertOne(sp1);

  console.log(kq);

  let sp = await Product.find();
  res.send(sp);
})
router.get('/update/:id', async (req, res) => {

    await mongoose.connect(uri);
  
    console.log('Ket noi DB thanh cong');
  
    let id = req.params.id;

    await Product.updateOne({_id: id}, {tensp:"VGA A", loaisp: "VGA", price: 5000000, image:"", color: "Hồng"});
  
    let sp = await Product.find({});
  
    res.send(sp);
  
  })
  router.get('/xoa/:id', async (req, res) => {

    await mongoose.connect(uri);
  
    console.log('Ket noi DB thanh cong');
  
    let id = req.params.id;

    await Product.deleteOne({_id: id});
    let sp = await Product.find({});
    res.send(sp);
  
  })
module.exports = router;