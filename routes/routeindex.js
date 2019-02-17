var express = require('express');
var routerdemo = express.Router();
var control = require('../controller/indexcontroller');
var upload = require('../utils/fileupload');
// 登录拦截器
// routerdemo.all('/*', control.all);
// 注册界面
routerdemo.get('/register', control.register);
// 注册提交
routerdemo.post('/register', upload.single('head'), control.registersubmit);
// 登录界面
routerdemo.get('/login', control.login);
// 登录提交
routerdemo.post('/login', control.loginsubmit);
// 进入主界面
routerdemo.get('/main', control.main);
// 退出主界面
routerdemo.get('/loginout', control.loginout);
module.exports = routerdemo;
