/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-8-16
 * Time: 下午6:16
 * To change this template use File | Settings | File Templates.
 */


app.get('/pagination', function (req, res) {

    var obj = Object.create(null);

    //随机生成一个总页数
    obj.totalPage = parseInt(Math.random() * 100 / 2, 10);

    obj.data = [];
    for (var i = 0; i < 10; i++) {
        obj.data.push({
            title:'第' + req.query.page + '页，' + Math.random()
        });
    }
    res.end(req.query.callback + '(' + JSON.stringify(obj, undefined, '    ') + ')');

});