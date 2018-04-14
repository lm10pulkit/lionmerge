var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dhujdb1zv', 
  api_key: '443542749568666', 
  api_secret: 'EkdDKqhZbal71U9z-BwaN97hAso' 
});
var uploadimage = function(path,callback){
cloudinary.uploader.upload(path, callback);
};
module.exports = uploadimage;