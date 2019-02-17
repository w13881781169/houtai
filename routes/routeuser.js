var express = require('express');
var routerdemo = express.Router();
var control = require('../controller/usercontroller');
var upload = require('../utils/fileupload');
// 添加用户信息界面
routerdemo.get('/add', control.add);
// 用户列表信息界面
routerdemo.get('/list', control.list);
// ajax验证用户名
routerdemo.post('/checkuser.do', control.check);
// 添加用户信息请求
routerdemo.post('/add', upload.single('head'), control.addsub);
// 删除用户信息
routerdemo.get('/delete', control.delete);
// 更新用户界面
routerdemo.get('/update', control.update);
// 更新数据提交
routerdemo.post('/update', upload.single('head'), control.updatesub);
// 下载文件
routerdemo.get('/down', function (req, res) {
    res.download('public/index.html');
});
module.exports = routerdemo;