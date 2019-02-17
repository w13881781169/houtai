/**
 * app.js模块
 * 作用：
 *      1.设置模板引擎：pug
 *      2.加载中间件
 *                 1.body-parser(json解析，名称值对解析)
 *                 get方法:   req.query.name  post方法： req.body.name
 *                 2.cookie-parser(向客户端存储cookie数据name)
 *                 res.cookie('name',value的json数据,{cookie设置的json参数})
 *                 req.cookies.name(获取客户端的cookie数据)
 *                 3.connect-flash传递一次性使用的session值
 *                 用法 保存值 req.flash('name',value) = req.session.name=value
 *                     获取值 var value= req.flash('name')等同于var value=req.session.name req.session.clearsession('name')
 *                 4.加载路由
 *                 5. http - errors 错误处理
 *      3启动web服务
 */
var pug = require('pug');
var bodyparser = require('body-parser');
var express = require('express');
var cookie = require('cookie-parser');
var session = require('express-session');
var routerindex = require('./routes/routeindex');
var routeruser = require('./routes/routeuser');
var routerproduct = require('./routes/routeproduct');
var createError = require('http-errors');
var flash = require('connect-flash');
var log4js = require('log4js');
var log4jsConfig = require('./config/log4jsConfig.json');
// 创建一个express实例instance，得到application对象
var app = express();
// =================1.设置默认模板引擎是pug====================================
app.engine('.pug', pug.__express);
app.set('view engine', 'pug');
app.set('views', 'views'); // 模板所在的目录为view
// ==================2.加载中间件============================================
log4js.configure(log4jsConfig);
app.use(express.static('public'));// 静态资源所在目录
app.use(bodyparser.json()); // 解析json类型数据
app.use(bodyparser.urlencoded({
    extended: false
})); // expanded:false表示解析值类型是string|Array, true表示解析值是任意类型
app.use(cookie());// 引入cookie中间件
// 引入session中间件
app.use(session({ // //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    name: 'web1803',
    secret: 'login',
    cookie: ({
        maxAge: 1000 * 60 * 60 * 24,
    }

    ),
    // 重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    // 强制“未初始化”的会话保存到存储。
    saveUninitialized: true,
}));
app.use(flash());// session参数的传递
app.use('/', routerindex);
app.use('/', routeruser);
app.use('/', routerproduct);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404)); // 创建404资源找不到错误,next方法交给error handler处理
});


// error handler; 处理所有错误
app.use(function (err, req, res, next) {
    console.log('err :' + err + '  err.status :' + err.status);
    res.status(err.status || 500); // 响应状态码如果没有响应500

    // 判断状态码显示404错误页面
    if (err.status === 404) {
        res.render('error/err404');
    } else {
        res.render('error/error', {
            message: err.message,
            error: {
                status: err.status,
                stack: err.stack,
            },
        });
    }
});
// =========================3.启动web服务=====================================
app.listen(8080, function () {
    console.log('启动服务器，监听8080端口');
});
