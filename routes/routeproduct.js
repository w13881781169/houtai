var express = require('express');
var productroutes = express.Router();
var control = require('../controller/productcontroller');
var upload = require('../utils/fileupload');
// 添加商品类型
productroutes.get('/addtype', control.addtype);
// 添加商品类型提交
productroutes.post('/addtype', control.addtypesub);
// 添加商品界面
productroutes.get('/addproduct', control.addproduct);
// 添加商品信息提交
productroutes.post('/addproduct', upload.single('productimg'), control.addproductsub);
module.exports = productroutes;
// 商品列表界面
productroutes.get('/productlist', control.productlist);
// 商品删除
productroutes.get('/productdelete', control.productdelete);
// 更新商品界面
productroutes.get('/productupdate', control.productupdate);
// 更新商品提交
productroutes.post('/productupdate', upload.single('productimg'), control.productupdatesub);
