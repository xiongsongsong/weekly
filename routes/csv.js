/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-31
 * Time: 下午5:12
 * To change this template use File | Settings | File Templates.
 */

'use strict';

function initDate(str) {
    var date = str.split('-');
    console.log(date)
}

exports.download = function (req, res) {

    var DB = require('../helper/db');
    var r = {};

    var start = initDate(req.params[0]);
    var end = initDate(req.params[1]);

    res.end(req.params.join(','));
    return;

    res.charset = 'utf-8';
    res.header('Content-Type', 'text/html;charset=utf-8');

    var user = require('../helper/user').frontList;

    Object.keys(user).forEach(function (item) {
        r['id_' + user[item].id] = {
            name: user[item].name,
            "real-name": user[item]['real-name'],
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0
        }
    });

    var a = {year: {'$gte': startYear, '$lte': endYear}, month: {$gte: startMonth, $lte: endMonth}, level: {'$gt': 0}}

    var logCollection = new DB.mongodb.Collection(DB.client, 'log');

    logCollection.find(a, {}).toArray(function (err, result) {

        result.forEach(function (item) {
            if (item.leave === undefined) r['id_' + item.front]['level' + item.level]++;
        });


        Object.keys(r).forEach(function (key) {
            r[key].levelCount = r[key].level1 + r[key].level2 + r[key].level3 + r[key].level4;
            r[key].oh = r[key].level1 * 20 + r[key].level2 * 30 + r[key].level3 * 50 + r[key].level4 * 100;
        });
        var list = {};
        list.arr = [];
        Object.keys(r).forEach(function (k) {
            var o = r[k];
            list.arr.push([o['real-name'], o.name, o.level1, o.level2, o.level3, o.level4, o.levelCount, o.oh]);
        });

        res.render('table', {layout: false, arr: list.arr})
    });
};
