var multer = require('multer');
var fs = require('fs');
var createfolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};
var uploader = './public/upload1/';
createfolder(uploader);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploader);
    },
    filename: function (req, file, cb) {
        var currentDate = Date.now();
        req.session.headurl = '/upload1/' + file.fieldname + '-' + currentDate + '.png';
        cb(null, file.fieldname + '-' + currentDate + '.png');
    }
});
var upload = multer({
    storage: storage
});
module.exports = upload ;
