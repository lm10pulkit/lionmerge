var express= require('express');
var app= express();
var fs = require('fs');
var mongoose = require('mongoose');
var bodyparser= require('body-parser');
var multer  = require('multer');
var cookieparser= require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var {hash,compare}= require('./hashing.js');
var {findById,findByUsername,addProduct,deleteProduct
  ,addImage,findProductById,allProduct
,filterProductByCategory
,filterProductBySubCategory
,addCategory
,addsubCategory
,removesubCategory
,removeCategory,findCategoryById,allCategory}= require('./db.js');
var remove = require('./photodeletion.js');
var uploadimage = require('./uploadimage');
const port = process.env.PORT||8080;
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
     var name ='cal'+ new Date().getTime()+".jpeg"; 
    callback(null, name);
  }
});
var MongoStore = require('connect-mongo')(session);
var upload = multer({ storage:storage});
//view engine
app.set('view engine','ejs');
//for forms
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// middleware for cookie parser
app.use(cookieparser());
//middleware for session
app.use(session(
	{
		secret:'secret',
	    saveUninitialized:true,
		resave:true,
		store : new MongoStore({mongooseConnection:mongoose.connection})
	}));
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
 
app.use(express.static(__dirname+'/public')); 

//connect flash for flashing messages
app.use(flash());
//serializing user
passport.serializeUser(function(user,done){
    done(null,user._id);
});
//deserializing user
passport.deserializeUser(function(id,done){
	findById(id,function(err,data){
       done(err,data);
	});
});
passport.use('signin',new localstrategy({
usernameField :'username',
passwordField : 'password',
passReqToCallback:true
},function(req,username,password,done){
	findByUsername(username,function(err,data){
		console.log(username);
		console.log(password);
       if(!data)
       {
         done(null,false,{message:"invalid"});
       }
       else
       {
          var check = compare(password,data.password);
          if(!check)
          	done(null,false,{message:"invalid"});
          else
          	done(null,data);
       }
	});  
}));
 var loggedin = function(req,res,next){
   if(req.user)
     next();
   else
    res.redirect('/adminLogin');
 };
app.get('/',function(req,res){
   res.render('home.ejs');
});
/*
app.post('/',upload.single('avatar'),function(req,res){
      var path = __dirname+ '/public/uploads/'+ req.file.filename;
     
     uploadimage(path,function(result){
        res.send(result);
        remove(req.file.filename,function(status){
          console.log(status);
        });
     });
    
});
*/
app.get('/adminlogin',function(req,res){
     res.render('adminLogin.ejs');
});
app.post('/signin',passport.authenticate('signin',{failureRedirect:"/adminlogin"}),function(req,res){
     res.redirect('/admin/addProduct');
});
app.get('/admin/addProduct',loggedin,function(req,res){
    res.render('addProduct');
});
app.post('/admin/addProduct',loggedin,function(req,res){
     var body = req.body;
      addProduct(body,function(err,data){
        res.redirect('/admin/addImage?id='+data._id);
      });
      
});
app.get('/admin/addImage',loggedin,function(req,res){
     res.render('uploadimage.ejs',{productid:req.query.id});
});
app.post('/admin/addImage/:id',[loggedin,upload.single('productimage')], function(req,res){
     var id = req.params.id;
     var name = req.file.filename;
     var path =__dirname+ "/public/uploads/"+name;
     uploadimage(path,function(data){
        addImage(id,data.secure_url,function(err,data){
            res.redirect('/admin/myproduct?id='+id);
        });
        remove(name,function(status){
            console.log(status);
        });
     });
});
app.get('/admin/myproduct',function(req,res){
  var id = req.query.id;
  findProductById(id,function(err,data){
     res.render('product',{data:data});
  });
});
app.get('/admin/allproducts',function(req,res){
    allProduct(function(err,data){
       res.render('myproductlist.ejs',{data:data});
    });
});
// all categories
app.get('/admin/allCategory',function(req,res){
    allCategory(function(err,data){
        res.render('allcategory',{data:data});      
    });
});
// route for adding a category
app.post('/admin/addCategory',function(req,res){
   var name = req.body.name;
   addCategory(name,function(err,data){
      var url = '/admin/category/'+data._id;
      res.redirect(url);
   });
});
// route for viewing category
app.get('/admin/category/:id',function(req,res){
    var id = req.params.id;
    findCategoryById(id,function(err,data){
        res.render('category.ejs',{data:data});
    });
});
// adding subcategory
app.post('/admin/addsubCategory/:id',function(req,res){
   var id = req.params.id;
   var subcategory = req.body.subcategory;
   addsubCategory(id,subcategory,function(err,data){
     var url ='/admin/category/'+id;
      res.redirect(url);
   });
});
// removing subcategory
app.get('/admin/removesubCategory/:id',function(req,res){
    var id = req.params.id;
    var subcategory= req.query.subcategory;
     console.log(subcategory);
    if(!id)
    {
      var url ='/admin/category/'+id;
      res.redirect(url);
    }
    if(!subcategory){
      var url ='/admin/category/'+id;
      res.redirect(url);
    }
    removesubCategory(id,subcategory,function(err,data){
       var url ='/admin/category/'+id;
      res.redirect(url);
    });
});
// route for deleting a category
app.get('/admin/deleteCategory/:id',function(req,res){
    var id = req.params.id;
    removeCategory(id,function(err,data){
        res.redirect('/admin/allCategory');
    });
});
app.use(function(req,res,next){
console.log(req.url);
res.send(req.url+" is not available");
});
app.listen(port,function(err){
console.log('connected to the port '+ port);
});