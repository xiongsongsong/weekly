/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-21
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');

var DB = require('./db');

exports.DBuser = Object.create(null);

//每隔2s，去数据库进行一次用户轮询
exports.init = function () {

    var collection = new DB.mongodb.Collection(DB.client, 'user');
    collection.find({}).toArray(function (err, docs) {
        var user = {};
        docs.forEach(function (item) {
            user['id_' + item._id] = {
                id: item._id,
                name: item.name,
                'real-name': item['real-name']
            }
        });
        exports.DBuser = user;
        exports.frontList = user;
    });
};


//检测一个用户是否已经(离职|转岗)
exports.isLeave = function () {

};

