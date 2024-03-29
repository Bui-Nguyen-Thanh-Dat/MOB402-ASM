var express = require('express');
var app = express();
var expresshbs= require('express-handlebars');
var Product= require("./models/modelProduct");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer =require('multer');
var fs=require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

  mongoose.connect('mongodb+srv://datbntph19949:thanhdat12345@cluster0.nbfpjmg.mongodb.net/dbProduct', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });

var storage=multer.diskStorage({
  destination: function (req,file,cb) {
     var dir='./uploads';
     if(!fs.existsSync(dir)){
      fs.mkdirSync(dir,{recursive:true});
     }
     cb(null,'./uploads')
  },
  filename:function (req,file,cb) {
    let fileName=file.originalname;
    arr=fileName.split('.');
    let newFileName='';
    for (let i = 0; i < arr.length; i++) {
      if (i!=arr.length -1) {
        newFileName+=arr[i];
      }else{
        newFileName += ('-'+Date.now()+'.'+arr[i]);
      }
    }
    cb(null,newFileName)
  }
})

const imagePath='./uploads';
app.use('/uploads',express.static(imagePath));

app.engine('.hbs', expresshbs.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

var usersRouter=require('./routes/users');
app.use('/users',usersRouter);
var apiRouter=require('./api/api');
app.use('/api',apiRouter );

app.get('/danhsach', async(req, res)=>{
  try {
    const data = await Product.find({}).lean();
    console.log(data);
      res.render('home',{
      layout:'listproduct',
      data:data
    });
  } catch (error) {
    console.error('Lỗi lấy dữ liệu:', error);
    res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
  }
  
});

var upload=multer({storage:storage});
app.post('/addproduct',upload.single('image'),async (req, res, next) => {
  let masp = req.body.masp;
  let tensp = req.body.tensp;
  let loaisp = req.body.loaisp;
 
  let price = req.body.price;
  let color = req.body.color;
  var image;
  if (req.file==null) {
    image="";
  }else{
    image="/uploads/"+req.file.filename;
  }
  let addProduct = new Product({
      masp: masp,
      tensp: tensp,
      loaisp: loaisp,
      price: price,
      image:image,
      color: color,
  })

  addProduct.save();
  let listproduct= Product.find().lean();

  res.redirect('/danhsach');
});

app.get('/addproduct/delete/:id', async (req, res)=>{
try {
  const product=await Product.findByIdAndDelete(req.params.id);
  
  if(!product){
    res.status(404).send("Không tìm thấy sản phẩm");
    res.status(200).send();
  }else{
    res.redirect('/danhsach');
  }
} catch (error) {
  res.status(500).send(error);
}
});

app.post('/updateproduct/update/:id',upload.single('image') ,async (req, res) => {
  const productId = req.params.id;
  let masp = req.body.masp;
  let tensp = req.body.tensp;
  let loaisp = req.body.loaisp;
  let price = req.body.price;
  let color = req.body.color;
  var image;
  if (req.file==null) {
    image="";
  }else{
    image="/uploads/"+req.file.filename;
  }

  // Thực hiện lưu dữ liệu vào MongoDB
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { masp, tensp, loaisp, price, image, color },
      { new: true }
    );
    console.log('Dữ liệu đã được cập nhật:', updatedProduct);
    res.redirect('/danhsach'); 
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu:', error);
   
  }
});

app.get('/updateproduct/:id', async(req, res)=>{
    const product=await Product.findById(req.params.id).lean();
    res.render('home',{
      layout:'suasanpham',
      data:product
    });
});

app.get('/addproduct',function(req, res){
    res.render('editoradd');
});

app.get('/search',async(req, res)=>{
    let search= req.body.search;

    const data= Product.findById({tensp:search}).lean();

    res.redirect('/users/danhsach?data=' + data);

})

app.listen(8000, function(){
    console.log("Server is running on port 8000");
});