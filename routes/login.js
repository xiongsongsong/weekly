/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-18
 * Time: 上午10:55
 * To change this template use File | Settings | File Templates.
 */

'use strict';

var http = require('http');
var DB = require('../helper/db');

exports.login = function (req, res) {
    var user = req.body.user;
    var pwd = req.body.pwd;
    var result = {};

    var collection = new DB.mongodb.Collection(DB.client, 'user');
    collection.findOne({'real-name': user}, {}, function (err, doc) {
        if (doc) {
            if (doc.pwd === pwd) {
                //登陆成功
                result.code = 1;
                req.session.username = user;
                req.session.userid = doc._id;
            } else {
                //密码不正确
                result.code = -1;
            }
        } else {
            //用户名不存在
            result.code = -2;
        }
        res.end(JSON.stringify(result, undefined, '\t'));
    });
};

//登出
exports.log_out = function (req, res) {
    res.clearCookie('remember');
    req.session.destroy();
    res.redirect('/');
};

//检查是否登陆
exports.isLogin = function (req) {
    if (req.cookies) {
        return  req.session.userid !== undefined && req.session.userid !== '';
    } else {
        return false;
    }
};
