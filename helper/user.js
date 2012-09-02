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
        http.get("http://localhost:9000/node/user-list/", function (res) {
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


var _init = false;

function processingUser(data) {
    try {
        data = JSON.parse(data);
        delete data.end;
        exports.DBuser = data;
        //当第一次获取到用户列表后
        //马上去mongodb中筛选出“前端”用户所对应的用户信息，比如用户名、昵称等
        if (_init === false) {
            _init = true;
            console.log('成功从拉取用户数据');
            exports.updateFrontList();
        }
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
            console.log((new Date).toLocaleString() + ',更新了用户列表。');
            if (param && param.callback) {
                param.callback();
            } else {
                return front;
            }
        });
    });
};

