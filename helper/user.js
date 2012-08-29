/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-21
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var BufferHelper = require('bufferhelper');

exports.DBuser = Object.create(null);

//每隔2s，去数据库进行一次用户轮询
exports.init = function () {
    var callee = arguments.callee;
    var bufferHelper = new BufferHelper();

    try {
        http.get("http://192.168.1.240/node/user-list/", function (res) {
            res.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('end', function () {
                processingUser(bufferHelper.toBuffer().toString());
                setTimeout(callee, 2000);
            });
            res.on('error', function (e) {
                console.log("接口服务器错误: " + new Date().toLocaleTimeString());
                console.log(e.toString());
            });
        });
    } catch (e) {
        console.log("无法联系用户列表接口: " + new Date().toLocaleTimeString());
        console.log(e.toString() + new Date().toLocaleTimeString());
        setTimeout(callee, 2000);
    }

};

function processingUser(data) {
    try {
        data = JSON.parse(data);
        delete data.end;
        exports.DBuser = data;
    }
    catch (err) {
        console.log('无法获取用户数据' + new Date().toLocaleTimeString());
    }
}

//检测一个用户是否已经(离职|转岗)
exports.isLeave = function () {

};

exports.updateFrontList = function (param) {
    var DB = require('../helper/db');
    DB.dbServer.createCollection('log', function (err, collection) {
        collection.distinct('front', {}, function (err, docs) {
            var front = Object.create(null);
            docs.forEach(function (item) {
                front['id_' + item] = exports.DBuser['id_' + item];
            });
            exports.frontList = front;
            if (param && param.callback) {
                param.callback();
            } else {
                return front;
            }
        });
    });
};

