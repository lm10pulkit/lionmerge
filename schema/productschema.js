var mongoose = require('mongoose');
var schema = mongoose.Schema;
var productschema = new schema ({
name :{
	type:String 
},
description:{
	type:String 
},
imageurl :{
	type:String 
},
price :{
	type:Number
},
category:{
	type:String
},
subcategory:{
	type:String 
}
});
var product =mongoose.model('product',productschema);
module.exports=product;