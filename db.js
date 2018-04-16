var mongoose = require('mongoose');
var {hash,compare} = require('./hashing.js');
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/lionmerge');
var admin= require('./schema/adminschema');
var product = require('./schema/productschema');
var category = require('./schema/categorySchema.js');
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
var addProduct = function(body,callback){
  var new_product = new product(body);
  new_product.save(callback);
};
var deleteProduct= function(productId,callback){
   product.remove({_id:productId},callback);
};
var addImage = function(productId,image,callback){
product.update({_id:productId},{imageurl:image},callback);
};
var findProductById = function(id,callback){
product.findOne({_id:id},callback);
};
var allProduct = function(callback){
product.find({},callback);
};
//,filterProductByCategory,filterProductBySubCategory,addCategory,addsubCategory,removesubCategory,removeCategory
var filterProductByCategory= function(category1,callback){
product.find({category:category1},callback);
};
var filterProductBySubCategory = function(category1,subcategory1,callback){
product.find({category:category1,subcategory:subcategory1},callback);
};
var addCategory = function(name,callback){
var new_category = new category({name:name});
new_category.save(callback);
};
var addsubCategory= function(id,subcategory1,callback){
category.update({_id:id},{$push:{subcategory:subcategory1}},callback);
};
var removesubCategory = function(id,subcategory1,callback){
category.update({_id:id},{$pull:{subcategory:subcategory1}},callback);
};
var removeCategory= function(id,callback){
category.remove({_id:id},callback);
};
var findCategoryById = function(id,callback){
category.findOne({_id:id},callback);
};
var allCategory = function(callback){
category.find({},callback);
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
product.find().then(function(data){
  console.log(data);
});
category.remove().then(function(data){console.log(data);});
module.exports ={
	findById,
	findByUsername,
  addProduct,
  deleteProduct,
  addImage,
  findProductById,
  allProduct,
  filterProductByCategory,
  filterProductBySubCategory,
  addCategory,
  addsubCategory,
  removesubCategory,
  removeCategory,
  findCategoryById,
  allCategory
};