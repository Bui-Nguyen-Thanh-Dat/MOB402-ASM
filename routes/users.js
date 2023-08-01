var express=require('express');
var router=express.Router();
var app = express();
var expresshbs= require('express-handlebars');
var User=require('../models/modelUser');

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
    res.render('home',{
        layout:'updateuser',
        data:user
    });
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
    console.log('Dữ liệu đã được cập nhật:', updatedUser);
    res.redirect('/users/listuser'); 
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
module.exports = router;