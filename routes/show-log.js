/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:25
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var DB = require('../helper/db');
var sanitize = require('validator').sanitize;

exports.show_log = function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    var year = parseInt(req.query.year, 10);
    var month = parseInt(req.query.month, 10);
    if (isNaN(year)) {
        year = new Date().getFullYear();
    }
    if (isNaN(month)) {
        month = new Date().getMonth() + 1;
    }

    var result = Object.create(null);

    var startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    startDate.setYear(year);
    startDate.setMonth(month - 1);

    var endDate = new Date(startDate.getTime());
    endDate.setDate(require('../helper/date').getMaxDays(startDate, month - 1));
    endDate.setHours(23, 59, 59, 999)


    var collection = new DB.mongodb.Collection(DB.client, 'log');


    collection.find({completion_date: {$gte: startDate.getTime(), $lte: endDate.getTime()}, level: {'$gt': 0}}, {}).sort([
            ['_id', 1]
        ]).toArray(function (err, docs) {
            docs.forEach(function (item, index) {
                Object.keys(item).forEach(function (k) {
                    if (typeof item[k] === 'string') item[k] = sanitize(item[k]).xss();
                })
                var _date = new Date(item.completion_date);
            });
            result.documents = docs;
            result.user = require('../helper/user').frontList;
            result.serverDate = Date.now();
            if (require('./login').isLogin(req)) result.userid = req.session.userid;
            res.end(JSON.stringify(result, undefined, '\t'));
        });
};
