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

exports.updateFrontList = function (param) {
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
        if (param && param.callback) {
            param.callback();
        }
    });
}

//检测一个用户是否已经(离职|转岗)
exports.isLeave = function () {

};

//获取日志文档中，所有的front-id（即uid）