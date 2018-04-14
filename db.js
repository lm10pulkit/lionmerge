var mongoose = require('mongoose');
var {hash,compare} = require('./hashing.js');
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/lionmerge');
var admin= require('./schema/adminschema');
var product = require('./schema/productschema');
var findById = function(id,callback){
 admin.findOne({_id:id},callback);
};
var findByUsername = function(username,callback){
  admin.findOne({username:username},callback);
};
var add = function(username,password,callback){
	password= hash(password);
   var data = {
   	username,
   	password
   };
   var new_admin = new admin(data);
   new_admin.save(callback);
};
/*
admin.remove().then(function(data){
	console.log(data);
});
add('pulkit','pulkit',function(err,data){
console.log(err);
console.log(data);
});
*/
module.exports ={
	findById,
	findByUsername
};