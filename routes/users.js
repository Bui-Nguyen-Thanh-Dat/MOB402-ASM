var express=require('express');
var router=express.Router();
var app = express();
var expresshbs= require('express-handlebars');
var User=require('../models/modelUser');
var Product=require('../models/modelProduct');

app.engine('.hbs', expresshbs.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

router.post('/dangky/adduser', function(req, res){
    if (req.body.password != req.body.repassword) {
        res.render('dangky',{
            alert:"Mật khẩu không trùng khớp",
        })
    }else{
        
        const { username,password } = req.body;
        let addUser= new User({
            username: username,
            password: password,
            role:"user"
        });
        addUser.save();
        res.render('dangky',{
            alert1:"Đăng ký thành công",
        })
        
    }
    
});

router.get('/listuser', async(req, res)=>{
  

   try { 
    const data= await User.find().lean();
    res.render('home',{
    layout:'listuser',
    data:data
    })
   } catch (error) {
    console.error('Lỗi lấy dữ liệu:', error);
    res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
   }
});
router.get('/delete/:id', async (req, res)=>{
    try {
      const user=await User.findByIdAndDelete(req.params.id);
      
      if(!user){
        res.status(404).send("Không tìm thấy sản phẩm");
        res.status(200).send();
      }else{
        res.redirect('/users/listuser');
      }
    } catch (error) {
      res.status(500).send(error);
    }
});

router.get('/update/:id',async (req, res)=> {
    const user=await User.findById(req.params.id).lean();
    console.log(user);
    if(user.role == 'admin'){
      res.render('home',{
        layout:'updateuser',
        data:user,
        role:user.role
    });
    }else{
      res.render('home',{
        layout:'updateuser',
        data:user,
        role:user.role
    });
    }
    
});
router.post('/update/:id', async (req, res)=>{
  const userId = req.params.id;
  const { username,password,role } = req.body;
  // Thực hiện lưu dữ liệu vào MongoDB
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username,password,role },
      { new: true }
    );
    
    res.redirect('/users/danhsach?login=' + username);
    console.log('Dữ liệu đã được cập nhật:', updatedUser);
      
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu:', error);
  }
});

router.get('/dangky', function(req, res){
    res.render('dangky');
});

router.get('/dangnhap', function(req, res){
    res.render('dangnhap');
})

router.post('/login',async(req, res)=>{
try {
  let data = await Product.find().lean();
  let userObj= await User.findOne({username: req.body.username});
  if(userObj!= null){
    if(userObj.password==req.body.password){
      if(userObj.role=="admin"){
        res.redirect('/users/danhsach?data=' + data + '&_id=' + userObj._id + '&login=' + userObj.username + '&role=' + userObj.role);
      }
      res.redirect('/users/danhsach?data=' + data + '&_id=' + userObj._id + '&login=' + userObj.username);
    }else{
       res.render('dangnhap',{
        alert:"username or password is incorrect"
      })
    }
  }
} catch (error) {
  
}

});
router.get('/add', function(req, res) {
  res.render('home',{
    layout:'adduser'
  })
});

router.post('/add', async(req, res)=>{
  const { username,password,role } = req.body;

  let addUser = new User({
    username: username,
    password:password,
    role:role,
})


  addUser.save();
  let listuser= User.find().lean();
  res.redirect('/users/listuser')

});

router.get('/danhsach', async(req, res)=> {
  const data = await Product.find({}).lean();
  res.render('home', {
    layout: 'listproduct',
    data: data,
    _id: req.query._id,
    login: req.query.login,
    role: req.query.role
  });
});
module.exports = router;