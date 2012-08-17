/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-8-16
 * Time: 下午6:16
 * To change this template use File | Settings | File Templates.
 */


exports.init = function (req, res) {
    switch (req.params.which) {
        case "pagination":
            exports.pagination(req, res);
            break;
    }
};

exports.pagination = function (req, res) {
    res.header('Content-Type', 'application/javascript;charset=utf-8');
    var obj = Object.create(null);

    //随机生成一个总页数
    obj.totalPage = parseInt(req.query.totalPage, 10);

    obj.data = [];
    for (var i = 0; i < 6; i++) {
        obj.data.push({
            title:'第' + req.query.page + '页，' + Math.random()
        });
    }
    setTimeout(function () {
        res.end(req.query.callback + '(' + JSON.stringify(obj, undefined, '    ') + ');');
    },500)
};

