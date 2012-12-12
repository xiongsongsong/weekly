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
            var user = require('../helper/user').frontList;
            var result = {
                docs: docs,
                user: user
            };

            var c = {
                "李成宁": {
                    "2012-07": [
                        {},
                        {},
                        {}
                    ]
                }
            };

            var r = Object.create(null);

            for (var u in user) {
                r[user[u]['real-name']] = {};
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
                html += '<h1>' + item + '</h1>';
                //每个人每月
                Object.keys(r[item]).forEach(function (log) {
                    html += '<h2>' + log + '</h2>';
                    r[item][log].forEach(function (p) {
                        html += '<h3>' + p['page-name'].trim() + '</h3>'
                        html += '<ul>' +
                            (p.customer.trim() ? '<li>需求方：' + p.customer + '</li>' : '') +
                            (p.design.trim() ? '<li>设计师：' + p.design + '</li>' : '') +
                            (p['online-url'].trim() ? '<li>线上地址：<a href="' + p['online-url'].trim() + '" target="_blank">' + p['online-url'] + '</a></li>' : '') +
                            (p['tms-url'].trim() ? '<li>TMS地址：<a href="' + p['tms-url'].trim() + '" target="_blank">' + p['tms-url'] + '</a></li>' : '') +
                            (p['note'].trim() ? '<li>备注：' + p['note'] : '') +
                            '</ul>';
                    });
                })
            });

            res.end(html)

        });
};