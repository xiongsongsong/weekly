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

/*修改密码*/
exports.changePwd = function (req, res) {
    var userid = req.session.userid;
    var collection = new DB.mongodb.Collection(DB.client, 'user');
    var result = {};
    var _id = DB.mongodb.ObjectID(userid);
    collection.findOne({_id: _id}, {}, function (err, doc) {
        if (doc) {
            //原始密码正确
            if (req.body.a === doc.pwd) {
                //检测新密码合法性
                if (/^[a-z0-9]{128}$/.test(req.body.b)) {
                    //开始更新密码
                    collection.update({ _id: _id }, {$set: {pwd: req.body.b}}, {}, function () {
                        result.code = 1;
                        res.end(JSON.stringify(result, undefined, '\t'))
                    })
                } else {
                    //新密码不能通过效验
                    result.code = -1;
                    res.end(JSON.stringify(result, undefined, '\t'))
                }
            }
            //原始密码不正确
            else {
                result.code = -5;
                res.end(JSON.stringify(result, undefined, '\t'))
            }
        } else {
            result.code = -4;
            res.end(JSON.stringify(result, undefined, '\t'))
        }
    });
}
