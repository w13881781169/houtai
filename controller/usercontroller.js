/* eslint-disable radix */
var query = require('../utils/querydb');
var crypto = require('../utils/md5');
// 添加用户界面函数
exports.add = function (req, res) {
    res.render('user/add_user');
};
// 用户列表信息函数
exports.list = async function (req, res, next) {
    var pageCount = 0;
    var currentpage = 1;
    var pageSize = 5;
    if (req.query.pageNo) {
        currentpage = req.query.pageNo;
    }
    try {
        var sql1 = 'select count(*) as count from user';
        var totalCount = await query(sql1);
        var total = totalCount[0].count; // 总记录数
        if (total % pageSize === 0) {
            pageCount = parseInt(total / pageSize);
        } else {
            pageCount = parseInt(total / pageSize) + 1;
        }
        var startindex = (currentpage - 1) * pageSize;
        var parmeter = [startindex, pageSize];
        var sql = 'select id,name,password,headurl from user limit ?,?';
        var userlist = await query(sql, parmeter);
        res.render('user/list_user', {
            'userlist': userlist,
            'currentPage': currentpage,
            'pageCount': pageCount,
        });
    } catch (err) {
        next(err);
    }
};
// ajax验证用户名
exports.check = async function (req, res, next) {
    var username = req.body.username;
    var sql = 'SELECT count(*) AS count  FROM user WHERE name = ?';
    var data = await query(sql, [username]);
    var num = data[0].count;
    // 判断用户名是否存在
    if (num !== 0) {
        res.send({
            code: 1,
            message: '该用户已经存在'});
    } else {
        res.send({
            code: 0,
        });
    }
};
// 添加用户信息提交
exports.addsub = async function (req, res, next) {
    var name = req.body.clientname;
    var password = req.body.password;
    var headurl = req.session.headurl;
    var psw = crypto(password);
    try {
        var sql = 'insert into user(name,password,headurl)values(?,?,?)';
        var parmeter = [name, psw, headurl];
        await query(sql, parmeter);
        res.redirect('/list');
    } catch (err) {
        next(err);
    }
};
// 删除用户信息
exports.delete = async function (req, res, next) {
    var id = req.query.uid;
    try {
        var sql = 'delete from user where id=?';
        var parmeter = [id];
        await query(sql, parmeter);
        res.redirect('list');
    } catch (err) {
        next(err);
    }
};
// 更新用户界面
exports.update = async function (req, res, next) {
    var id = req.query.uid;
    try {
        var sql = 'select id,name,password,headurl from user where id=?';
        var parmeter = [id];
        var data = await query(sql, parmeter);
        res.render('user/update_user', data[0]);
    } catch (err) {
        next(err);
    }
};
// 更新数据提交
exports.updatesub = async function (req, res, next) {
    var id = req.body.id;
    var name = req.body.clientname;
    var password = req.body.password;
    var headurl = req.session.headurl;
    var psw = crypto(password);
    try {
        var sql = 'update user set name=?,password=?,headurl=? where id=?';
        var parmeter = [name, psw, headurl, id];
        await query(sql, parmeter);
        res.redirect('/list');
    } catch (err) {
        next(err);
    }
};
