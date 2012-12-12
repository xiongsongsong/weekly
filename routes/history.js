/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-11
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var DB = require('../helper/db');

exports.history = function (req, res) {
    res.header('Content-Type', 'text/html;charset=utf-8');
    var collection = new DB.mongodb.Collection(DB.client, 'log');
    collection.find({level: {'$gt': 0}}, {}).sort([
            ['_id', 1]
        ]).toArray(function (err, docs) {
            var first = docs[0].year + '年' + docs[0].month + '月' + docs[0].date + '日';
            var length = docs.length - 1;
            var end = docs[length].year + '年' + docs[length].month + '月' + docs[length].date + '日';
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
                    if (_user[item.year + '-' + item.month]) {
                        _user[item.year + '-' + item.month].push(item)
                    } else {
                        _user[item.year + '-' + item.month] = [item];
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
                first: first,
                end: end
            });

        });
};
