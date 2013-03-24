/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:25
 * 负责记录日志和更新日志
 */

'use strict';

var DB = require('../helper/db');

exports.save_log = function (req, res) {
    var errorMSG = Object.create(null);
    errorMSG.errorList = [];

    var data = Object.create(null), body = req.body;
    data['page-name'] = body['page-name'];
    data['level'] = parseInt(body['level'], 10);
    data['design'] = body['design'];
    data['customer'] = body['customer'];
    data['online-url'] = body['online-url'];
    data['tms-url'] = body['tms-url'];
    data['note'] = body['note'];

    var year = parseInt(body['year'], 10);
    var month = parseInt(body['month'], 10);
    var date = parseInt(body['date'], 10);

    var isEdit = body['type'] === 'edit';

    if (!require('./login').isLogin(req)) {
        errorMSG.errorList.push({msg: '登陆过期，请刷新页面重新登陆'});
    }

    if (data['page-name'] == undefined || data['page-name'].length < 1) {
        errorMSG.errorList.push({name: 'page-name', msg: '页面名称不能为空'});
    }

    if (isNaN(data['level'])) {
        errorMSG.errorList.push({name: 'level', msg: '需要页面对应的等级'});
    }

    if (isNaN(year) || isNaN(month) || isNaN(date)) {
        isNaN(year) ? errorMSG.errorList.push({name: 'year', msg: '年份填写错误'}) : undefined;
        isNaN(month) ? errorMSG.errorList.push({name: 'month', msg: '月份填写错误'}) : undefined;
        isNaN(date) ? errorMSG.errorList.push({name: 'date', msg: '日期填写错误'}) : undefined;
    } else {
        if (year < 1949 || year > 2100) {
            errorMSG.errorList.push({name: 'year', msg: '年份越界'});
        }

        if (month < 1 || month > 12) {
            errorMSG.errorList.push({name: 'month', msg: '月份越界'});
        }

        if (month == 2) {
            if (year % 4 == 0) {
                if (date > 29 || date < 1) {
                    errorMSG.errorList.push({name: 'date', msg: '闰年2月日期无效'});
                }
            } else {
                if (date > 28 || date < 1) {
                    errorMSG.errorList.push({name: 'date', msg: '2月日期无效'});
                }
            }
        } else {
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) >= 0) {
                if (date < 1 || date > 31) {
                    errorMSG.errorList.push({name: 'date', msg: '日期无效'});
                }
            } else if ([4, 6, 9, 11].indexOf(month) >= 0) {
                if (date < 1 || date > 30) {
                    errorMSG.errorList.push({name: 'date', msg: '日期无效'});
                }
            }
        }
    }

    if (isEdit && !body['object_id']) errorMSG.errorList.push('无法获取即将更新文档的必要信息');

    if (errorMSG.errorList.length > 0) {
        res.end(JSON.stringify(errorMSG), undefined, '\t');
        return;
    }

    //页面完成的时间
    var completionDate = new Date();
    completionDate.setFullYear(year, month - 1, date);
    data['completion_date'] = completionDate.getTime();

    //上传时间
    data['save_time'] = Date.now();
    data['front'] = req.session.userid;


    var collection = new DB.mongodb.Collection(DB.client, 'log');

    console.log(data)

    if (isEdit) {
        collection.update({
            _id: DB.mongodb.ObjectID(body['object_id']),
            front: req.session.userid
        }, {
            $set: data
        }, {}, function () {
            res.end(JSON.stringify({'status': true}, undefined, '    '));
        });
    } else {
        collection.insert(data, {safe: true},
            function () {
                //如果当前用户是第一次添加日志，则立即更新用户列表的缓存
                if (require('../helper/user').frontList['id_' + req.session.userid] === undefined) {
                    require('../helper/user').updateFrontList({
                        callback: function () {
                            res.end(JSON.stringify({'status': true}, undefined, '    '));
                        }
                    });
                } else {
                    res.end(JSON.stringify({'status': true}, undefined, '    '));
                }
                //When adding a log, automatic backup of the database
                require('../helper/dump').dump(req);
            });
    }
};


