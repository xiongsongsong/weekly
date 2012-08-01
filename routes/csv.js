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
    var filename = '本部前端' + year + '年' + month + '业务统计报表';
    //IE中文件名要encodeURL，下载时方能正确显示文件名
    if (/(msie)/gi.test(req.headers['user-agent'])) {
        filename = encodeURIComponent(filename);
    }
    var date = new Date();
    res.header('Content-Disposition', 'attachment; filename=' + filename + '.csv');

    $("fed.user").find(function (result) {
        result.documents.forEach(function (item) {
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
            list.arr.push('姓名,花名,简单,一般,常规,复杂,页面合计,提成');
            Object.keys(r).forEach(function (k) {
                var o = r[k];
                list.arr.push([o['real-name'], o.name, o.level1, o.level2, o.level3, o.level4, o.levelCount, o.oh].join(','));
            });
            if (year === date.getFullYear() && month === date.getMonth() + 1) {
                list.arr.push('此表统计的是截止' + date.getFullYear() + '年' +
                    (date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + '时' +
                    date.getMinutes() + '分' + date.getSeconds() + '秒' +
                    '的数据，您下载此表时，当月还未结束，故数据可能不完整');
                list.arr.push('提示：下载上一月的数据是安全的。')
            }
            if (year >= date.getFullYear() && month > date.getMonth() + 1) {
                list.arr.push('错误，您要求下载' + year + '年' + month + '月份的统计数据，但该月份还未到来。')
            }
            res.end(list.arr.join('\r\n'));
        });
    });
};