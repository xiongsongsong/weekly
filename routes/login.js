/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-18
 * Time: 上午10:55
 * To change this template use File | Settings | File Templates.
 */

'use strict';

var http = require('http');
var BufferHelper = require('bufferhelper');

exports.login = function (req, res) {
    var content = {
        "user":encodeURIComponent(req.body.user),
        'pwd':encodeURIComponent(req.body.pwd)
    };

    /*var options = {
     host:'192.168.1.240',
     port:80,
     path:'/node/check/',
     method:'POST',
     headers:{
     'Content-Type':'application/x-www-form-urlencoded',
     'Connection':'Close'
     }
     };

     var request = http.request(options, function (response) {
     var bufferHelper = new BufferHelper();
     response.on('data', function (chunk) {
     bufferHelper.concat(chunk);
     });
     response.on('end', function () {
     try {
     var result = bufferHelper.toBuffer().toString();
     var obj = JSON.parse(result);
     if (typeof obj['UID'] == 'number') {
     res.write(result);
     req.session.username = req.body.user;
     req.session.userid = obj['UID'];
     } else {
     res.write('{"status":"UID is null"}');
     }

     } catch (err) {
     console.log(err);
     res.write('{"status":"Unable to link login authentication services."}');
     }
     res.end();
     });
     });

     request.write(Object.keys(content).map(function (item) {
     return item + '=' + content[item];
     }).join('&'));
     request.end();*/

    var userList = (require('../helper/temp').userList);
    Object.keys(userList).forEach(function (item) {
        if (req.body.user === userList[item]['real-name']) {
            res.write('{"status":true}');
            req.session.username = req.body.user;
            req.session.userid = userList[item].id;
            res.end();
        }
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
