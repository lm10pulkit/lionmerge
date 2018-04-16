var mongoose = require('mongoose');
var schema = mongoose.Schema;
var categorySchema = new schema ({
     name:{
         type:String,
         required:true 
     },
     subcategory:[String]	
});
var category = mongoose.model('category',categorySchema);
module.exports=category;