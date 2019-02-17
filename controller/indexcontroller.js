var query = require('../utils/querydb');
var crypto = require('../utils/md5');
var log = require('log4js').getLogger();
// 登录拦截器函数
exports.all = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        var arr = req.url.split('/');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split('?')[0];
        }
        var requrl = arr.join('/');
        if (requrl.endsWith('login') || requrl.endsWith('checkuser.do') || requrl.endsWith('register') || requrl.endsWith('loginout' || requrl === '')) {
            next();
        } else {
            req.session.originalUrl = req.originalUrl;
            req.flash('error', '请重新登录');
            res.redirect('/login');
        }
    }
};
// 注册界面
exports.register = function (req, res) {
    res.render('register');
};
// 注册界面提交
exports.registersubmit = async function (req, res, next) {
    var name = req.body.clientname;
    var password = req.body.password;
    var headurl = req.session.headurl;
    var psw = crypto(password);
    try {
        var sql = 'insert into user(name,password,headurl)values(?,?,?)';
        var parmeter = [name, psw, headurl];
        await query(sql, parmeter);
        res.redirect('/login');
    } catch (err) {
        next(err);

    }
};
// 登录界面函数
exports.login = function (req, res) {
    var msg = req.flash('error');
    log.debug('进入登录界面');
    if (req.cookies.user) {
        var username = req.cookies.user.user;
        var password = req.cookies.user.password;
        var json = {
            'error': msg,
            'username': username,
            'password': password,
        };
        res.render('login', json);
    } else {
        res.render('login', {
            'error': msg,
        });
    }

};
// 登录提交函数
exports.loginsubmit = async function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var savecookie = req.body.savepassword;
    var psw = crypto(password);
    try {
        var sql = 'select id,name,password,headurl from user where name=? and password=?';
        var parmeter = [username, psw];
        var data = await query(sql, parmeter);
        if (data.length === 0) {
            var json = {
                'error': '用户名或者密码输入错误',
            };
            res.render('login', json);
        } else {
            if (savecookie === 'on') {
                res.cookie('user', {
                    'user': username,
                    'password': password,
                }, {
                    maxAge: 1000 * 60 * 60,
                });
            } else {
                res.clearCookie('user');
            }
            var headurl = data[0].headurl;
            req.session.user = { 'username': username,
                'headurl': headurl } ;
            // console.log(req.sessionID);
            var redirecturl = '/main';
            if (req.session.originalUrl) {
                redirecturl = req.session.originalUrl;
                req.session.originalUrl = null;
            }
            res.redirect(redirecturl);
        }
    } catch (err) {
        next(err);
    }

};
// 进入主页面
exports.main = function (req, res) {
    var json = {headurl: req.session.user.headurl,
        username: req.session.user.username};
    res.render('index', json);
};
// 退出页面
exports.loginout = function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
};
