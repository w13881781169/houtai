var pug = require('pug');
var fs = require('fs');

var str = pug.renderFile('./views/index.pug', {
    pretty: true, //格式html文档
    // username: '小明',
    // password: '123',
    // week: ['周一', '周二', '周三', '周四','周五']
});
// console.log(str);

fs.writeFile('./build/index.html', str, function (err) {
    if (err)
        console.log("编译失败" + err);
    else
        console.log("编译成功");
});