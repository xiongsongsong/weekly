/*
 * GET home page.
 */

var $ = require("mongous").Mongous;


/*$("database.collection").find({},function(r){
 console.log(r);
 });*/

exports.index = function (req, res) {
    res.render('index', { title:'Express', date:new Date() })
};

exports.save_log = function (req, res) {
    var data = Object.create(null), body = req.body;
    data['page-name'] = body['page-name'];
    data['front'] = parseInt(body['front'], 10);
    data['level'] = parseInt(body['level'], 10);
    data['design'] = body['design']
    data['customer'] = body['customer'];
    data['online-url'] = body['online-url'];
    data['tms-url'] = body['tms-url'];
    data['note'] = body['note'];
    data['year'] = parseInt(body['year'], 10);
    data['month'] = parseInt(body['month'], 10);
    data['date'] = parseInt(body['date'], 10);

    var errorMSG = Object.create(null);
    errorMSG.errorList = [];

    if (data['page-name'] == undefined || data['page-name'].length < 1) {
        errorMSG.errorList.push({name:'page-name', msg:'页面名称不能为空'});
    }

    if (isNaN(data['front'])) {
        errorMSG.errorList.push({name:'front', msg:'需要页面对应的前端'});
    }

    if (isNaN(data['level'])) {
        errorMSG.errorList.push({name:'level', msg:'需要页面对应的等级'});
    }

    if (isNaN(data['year']) || isNaN(data['month']) || isNaN(data['date'])) {
        errorMSG.errorList.push({name:'year', msg:'完成时间无效'});
    } else {

        if (data['year'] < 2000 || data['year'] > 2100) {
            errorMSG.errorList.push({name:'year', msg:'年份越界'});
        }

        if (data['month'] < 1 || data['month'] > 12) {
            errorMSG.errorList.push({name:'date', msg:'月份越界'});
        }

        if (data['month'] == 2) {
            if (data['year'] % 4 == 0) {
                if (data['date'] > 29 || data['date'] < 1) {
                    errorMSG.errorList.push({name:'date', msg:'闰年2月日期无效'});
                }
            } else {
                if (data['date'] > 28 || data['date'] < 1) {
                    errorMSG.errorList.push({name:'date', msg:'2月日期无效'});
                }
            }
        } else {
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(data['month']) >= 0) {
                if (data['date'] < 1 || data['date'] > 31) {
                    errorMSG.errorList.push({name:'date', msg:'日期无效'});
                }
            } else if ([4, 6, 9, 11].indexOf(data['month']) >= 0) {
                if (data['date'] < 1 || data['date'] > 30) {
                    errorMSG.errorList.push({name:'date', msg:'日期无效'});
                }
            }
        }
    }

    if (errorMSG.errorList.length > 0) {
        res.end(JSON.stringify(errorMSG), undefined, '\t');
    } else {
        data._id = parseInt(Date.now().toString() + data['front'].toString() + data['level'].toString() +
            Math.random() * 1000, 10);
        $("fed.log").save(data);
        $("fed.log").find({_id:data._id}, function (result) {
            res.end(JSON.stringify(result, undefined, '\t'));
        });
    }
};

exports.record_log = function (req, res) {

};


exports.show_log = function (req, res) {
    $("fed.log").find(10, {month:7}, function (result) {
        res.end(JSON.stringify(result, undefined, '\t'));
    });
};


exports.helper = function (req, res) {

    for (var i = 0; i < 40; i++) {
        $("fed.log").save({
                "page-name":"12",
                "front":(function () {
                    var i = parseInt(Math.random() * 13);
                    while (i < 1 || i > 13) {
                        i = parseInt(Math.random() * 13);
                    }
                    return i;
                })(),
                "level":(function () {
                    var i = parseInt(Math.random() * 4);
                    while (i < 1 || i > 4) {
                        i = parseInt(Math.random() * 4);
                    }
                    return i;
                })(),
                "design":parseInt(Math.random() * 100000000000, 10).toString(),
                "customer":parseInt(Math.random() * 100000000000, 10).toString(),
                "online-url":"http://" + parseInt(Math.random() * 100000000000, 10).toString(),
                "tms-url":"http://" + parseInt(Math.random() * 100000000000, 10).toString(),
                "note":parseInt(Math.random() * 100000000000, 10).toString(),
                "year":2012,
                "month":7,
                "date":(function () {
                    var i = parseInt(Math.random() * 31);
                    while (i < 1 || i > 31) {
                        i = parseInt(Math.random() * 31);
                    }
                    return i;
                })(),
                "_id":parseInt(Date.now() + Math.random() * 1000000, 10)
            }
        );
    }

    res.end('保存了假数据')
};

