var crypto = require('crypto');
var md5 = crypto.createHash('md5');
md5.update('123'); // 加密
var psw = md5.digest('hex');
console.log(psw);