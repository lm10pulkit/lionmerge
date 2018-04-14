var mongoose = require('mongoose');
var schema = mongoose.Schema;
var adminschema = new schema ({
username:{
type:String,
required:true
},
password:{
type:String,
required:true
}
});
var admin = mongoose.model('admin',adminschema);
module.exports=admin;