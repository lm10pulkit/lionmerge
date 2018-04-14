var fs = require('fs');
var remove = function(name, callback){
   var path = __dirname+ '/public/uploads/'+name;
   console.log(path);
   fs.unlink(path, function(err){
       if(err){
       	callback({status:false});
       }
       else
       	callback({status:true});
   });
};
module.exports=remove;