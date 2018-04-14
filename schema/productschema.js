var mongoose = require('mongoose');
var schema = mongoose.Schema;
var productcshema = new schema ({
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