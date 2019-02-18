var express = require('express');
var routerdemo = express.Router();
var control = require('../controller/indexcontroller');
var upload = require('../utils/fileupload');
var svgCaptcha = require('svg-captcha');
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
// 验证码
routerdemo.get('/codeImg.do', function (req, res, next) {
    var codeConfig = {
        size: 5, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44,
    };
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text.toLowerCase(); // 存session用于验证接口获取文字码
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(String(captcha.data));
    res.end();
});
// AJAX 验证验证码
routerdemo.post('/checkimg', function (req, res, next) {
    var code = req.body.code;
    if (code !== req.session.captcha) {
        res.send({
            code: 1,
            message: '验证码输入错误',
        });
    }
});
module.exports = routerdemo;


