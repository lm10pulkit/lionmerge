var express= require('express');
var app= express();
var fs = require('fs');
var bodyparser= require('body-parser');
var multer  = require('multer');
var cookieparser= require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var {hash,compare}= require('./hashing.js');
var {findById,findByUsername}= require('./db.js');
var remove = require('./photodeletion.js');
var uploadimage = require('./uploadimage');
const port = process.env.PORT||8080;
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
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
app.get('/',function(req,res){
res.render('imageupload.ejs');
});
app.get('/yo',function(req,res){
   res.sendFile(__dirname+'/goodmorning.html');
});
app.post('/',upload.single('avatar'),function(req,res){
      var path = __dirname+ '/public/uploads/'+ req.file.filename;
      console.log(path);
      console.log(req.file);
      if(req.file){
     uploadimage(path,function(result){
        res.send(result);
     });
     }
     else
     	res.send(req.file);
});

app.get('/adminLogin',function(req,res){
     res.render('adminLogin.ejs');
});
app.post('/signin',passport.authenticate('signin',{failureRedirect:"/adminLogin"}),function(req,res){
	console.log(req.user);
    res.send(req.user);
});
app.use(function(req,res,next){
console.log(req.url);
res.send(req.url);
});
app.listen(port,function(err){
console.log('connected to the port '+ port);
});