/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-11
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var DB = require('../helper/db');

function initDate(str) {
    var date = str.split('-');
    var _date = new Date();
    var year = parseInt(date[0], 10);

    if (!isNaN(year) && year.toString().length === 4) {
        _date.setFullYear(year);
    } else {
        return false;
    }

    var month = parseInt(date[1], 10);
    if (month >= 1 && month <= 12) {
        _date.setMonth(month - 1)
    } else {
        return false;
    }

    var date = parseInt(date[2], 10);
    if (date >= 1 && date <= require('../helper/date').getMaxDays(_date, _date.getMonth())) {
        _date.setDate(date);
    } else {
        return false;
    }
    _date.setHours(0, 0, 0, 0);
    return _date;
}


exports.history = function (req, res) {

    var DB = require('../helper/db');

    var start = initDate(req.params[0]);
    var end = initDate(req.params[1]);

    res.header('Content-Type', 'text/html;charset=utf-8');

    if (!start || !end) {
        res.render('table-error', {layout: false, host: req.headers.host, msg: "起始或结束日期不正确"})
        return;
    }
    if (start.getTime() > end.getTime()) {
        res.render('table-error', {layout: false, host: req.headers.host, msg: "起始日期不能大于结束日期"})
        return;
    }


    console.log(req.params,end)

    end.setHours(23, 59, 59, 999);

    var filter = {completion_date: {'$gte': start.getTime(), '$lte': end.getTime()}, level: {'$gt': 0} }

    res.header('Content-Type', 'text/html;charset=utf-8');
    var collection = new DB.mongodb.Collection(DB.client, 'log');
    collection.find(filter).sort([
            ['_id', 1]
        ]).toArray(function (err, docs) {
            var length = docs.length;
            var firstDate = start.getFullYear() + '年' + (start.getMonth() + 1) + '月' + start.getDate() + '日';
            var endDate = end.getFullYear() + '年' + (end.getMonth() + 1) + '月' + end.getDate() + '日';
            var user = require('../helper/user').frontList;
            var result = {
                docs: docs,
                user: user
            };

            var r = Object.create(null);

            for (var u in user) {
                r[user[u]['real-name']] = {"wangwang": user[u]['name'] };
            }

            result.docs.forEach(function (item) {

                var _user = r[user['id_' + item.front]['real-name']];
                if (_user) {
                    var date = new Date(item['completion_date']);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    if (_user[year + '-' + month]) {
                        _user[year + '-' + month].push(item)
                    } else {
                        _user[year + '-' + month] = [item];
                    }
                }
            });

            var html = '';

            //每个人
            Object.keys(r).forEach(function (item, index) {
                html += '<h1>' + item + '<span>' + r[item].wangwang + '</span>' + '</h1>';
                //每个人每月
                Object.keys(r[item]).forEach(function (log) {
                    if (log !== 'wangwang') {
                        html += '<h2>' + log + '</h2>';
                        r[item][log].forEach(function (p) {
                            var onlineurl = p['online-url'].trim();
                            var tmsurl = p['tms-url'].trim();

                            html += '<h3>' + p['page-name'].trim() + '</h3>'
                            html += '<ul>' +
                                (p.customer.trim() ? '<li>需求方：' + p.customer + '</li>' : '') +
                                (p.design.trim() ? '<li>设计师：' + p.design + '</li>' : '') +
                                (onlineurl ? '<li>线上地址：<a href="' + (onlineurl.indexOf('http://') >= 0 ? onlineurl : 'http://' + onlineurl) + '" target="_blank">' + p['online-url'] + '</a></li>' : '') +
                                (tmsurl ? '<li>TMS地址：<a href="' + (tmsurl.indexOf('http://') >= 0 ? tmsurl : 'http://' + tmsurl) + '" target="_blank">' + p['tms-url'] + '</a></li>' : '') +
                                ('<li>页面等级：' + ['简单', '一般', '常规', '复杂'][p['level'] - 1] + '</li>') +
                                (p['note'].trim() ? '<li>备注：' + p['note'] + '</li>' : '') +
                                '</ul>';
                        });
                    }
                })
            });


            res.render('history', {
                title: '前端业务日志',
                layout: false,
                body: html,
                docLength: length,
                first: firstDate,
                end: endDate,
                path: req.path.replace('history', 'csv')
            });
        }
    );
};
