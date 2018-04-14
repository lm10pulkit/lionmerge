 var passwordHash = require('password-hash');
var hash = function(plain){
  var hashedPassword = passwordHash.generate(plain);
    return hashedPassword;
};
var compare = function(plain,hash){
  var check = passwordHash.verify(plain,hash);
  return check;
};
module.exports ={
hash,compare
} ; 