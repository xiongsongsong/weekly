/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-31
 * Time: 下午5:12
 * To change this template use File | Settings | File Templates.
 */


exports.download = function (req, res) {
    res.charset = 'utf-8';
    var $ = require("mongous").Mongous;
    var r = {};
    var year = parseInt(req.params.year, 10),
        month = parseInt(req.params.month, 10);
    res.header('Content-Type', 'text/csv;charset=utf-8');
    var filename = '本部前端' + year + '年' + month + '月页面提成统计表';
    var date = new Date();
    var isFull = true;
    if (year >= date.getFullYear() && month >= date.getMonth() + 1) {
        isFull = false;
        filename += '注意：您统计的是当前月，数据可能不完整';
    }

    res.header('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename) + '.csv');

    $("fed.user").find(function (result) {
        result.documents.forEach(function (item, index) {
            r['id_' + item._id] = {
                name:item.name,
                "real-name":item['real-name'],
                level1:0,
                level2:0,
                level3:0,
                level4:0
            }
        });
        $("fed.log").find(300, {year:year, month:month}, function (result) {
            result.documents.forEach(function (item) {
                r['id_' + item.front]['level' + item.level]++;
            });
            Object.keys(r).forEach(function (key) {
                r[key].levelCount = r[key].level1 + r[key].level2 + r[key].level3 + r[key].level4;
                r[key].oh = r[key].level1 * 20 + r[key].level2 * 30 + r[key].level3 * 50 + r[key].level4 * 100;
            });
            var list = {};
            list.arr = [];
            list.arr.push('姓名,花名,简单,一般,常规,复杂,页面合计,提成合计');
            Object.keys(r).forEach(function (key) {
                var o = r[key];
                var _tempArr = [];
                _tempArr.push(o['real-name'], o.name, o.level1, o.level2, o.level3, o.level4, o.levelCount, o.oh);
                list.arr.push(_tempArr.join(','));
            });
            if (isFull === false) {
                list.arr.push('您下载该表的时间为' + date.getFullYear() + '年' +
                    (date.getMonth() + 1) + '月' + date.getDate() + '日，意味着当前月还未结束，故数据可能不完整。提示：下载上一月的数据是安全的。')
            }
            res.end(list.arr.join('\r\n'));
        });
    });
};