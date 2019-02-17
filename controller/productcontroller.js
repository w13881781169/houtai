var query = require('../utils/querydb');
// 添加商品类型界面
exports.addtype = function (req, res, next) {
    res.render('product/addtype');
};
// 添加商品类型提交
exports.addtypesub = async function (req, res, next) {
    var name = req.body.productname;
    try {
        var sql = 'insert into product_type (name) values(?)';
        console.log(name);
        await query(sql, [name]);
        res.send('数据添加成功');
    } catch (err) {
        next(err);
    }
};
// 添加商品界面
exports.addproduct = async function (req, res, next) {
    var sql = 'select pid,name from product_type';
    var data = await query(sql);
    res.render('product/add', {type: data});
};
// 添加商品信息提交
exports.addproductsub = async function (req, res, next) {
    var productname = req.body.productname;
    var produce = req.body.produce;
    var newprice = req.body.newprice;
    var oldprice = req.body.oldprice;
    var productimg = req.session.headurl;
    var discount = req.body.discount;
    var typeid = req.body.typeid;
    try {
        var sql = 'insert into phonelist (name,produce,newprice,oldprice,img,discount,typeid)values(?,?,?,?,?,?,?)';
        var parmeter = [productname, produce, newprice, oldprice, productimg, discount, typeid];
        await query(sql, parmeter);
        res.redirect('/productlist');
    } catch (err) {
        next(err);
    }

};
// 商品列表界面
exports.productlist = async function (req, res, next) {
    var pageCount = 0;
    var currentpage = 1;
    var pageSize = 5;
    if (req.query.pageNo) {
        currentpage = req.query.pageNo;
    }
    try {
        var sql1 = 'select count(*) as count from phonelist';
        var totalCount = await query(sql1);
        var total = totalCount[0].count; // 总记录数
        if (total % pageSize === 0) {
            pageCount = parseInt(total / pageSize);
        } else {
            pageCount = parseInt(total / pageSize) + 1;
        }
        var startindex = (currentpage - 1) * pageSize;
        var parmeter = [startindex, pageSize];
        var sql = 'select id,name,produce,newprice,oldprice,img,discount,typeid from phonelist order by id desc limit ?,?';
        var userlist = await query(sql, parmeter);
        res.render('product/productlist', {
            'userlist': userlist,
            'currentPage': currentpage,
            'pageCount': pageCount,
        });
    } catch (err) {
        next(err);
    }
};
// 删除商品
exports.productdelete = async function (req, res, next) {
    try {
        var sql = 'delete from phonelist where id=?';
        var id = req.query.uid;
        await query(sql, [id]);
        res.redirect('/productlist');
    } catch (err) {
        next(err);
    }
};
// 商品更新页面
exports.productupdate = async function (req, res, next) {
    try {
        var sql = 'select pid,name from product_type';
        var data = await query(sql);
        var id = req.query.uid;
        var sql1 = 'select id,name,produce,newprice,oldprice,img,discount,typeid from phonelist where id=?';
        var parmeter = [id];
        var data1 = await query(sql1, parmeter);
        var json = {
            type: data,
            data1: data1[0],
        };
        res.render('product/update', json);
    } catch (err) {
        next(err);
    }
};
// 商品更新提交
exports.productupdatesub = async function (req, res, next) {
    var id = req.body.id;
    var name = req.body.productname;
    var produce = req.body.produce;
    var newprice = req.body.newprice;
    var oldprice = req.body.oldprice;
    var productimg = req.session.headurl;
    var discount = req.body.discount;
    var typeid = req.body.typeid;
    try {
        var sql = 'update phonelist set name=?,produce=?,newprice=?,oldprice=?,img=?,discount=?,typeid=? where id=?';
        var parmeter = [name, produce, newprice, oldprice, productimg, discount, typeid, id];
        await query(sql, parmeter);
        res.redirect('/productlist');
    } catch (err) {
        next(err);
    }
};
