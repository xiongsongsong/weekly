/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:26
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var https = require('https');
var BufferHelper = require('bufferhelper');

function getWtp() {
    https.get('https://api.github.com/repos/lifesinger/lifesinger.github.com/issues?state=opend',function (res) {

        var bufferHelper = new BufferHelper();
        res.on('data', function (d) {
            bufferHelper.concat(d);
        });

        res.on('end', function () {
            var html = bufferHelper.toBuffer().toString();
            try {
                exports.wtp = JSON.parse(html);
            } catch (e) {
                console.log('wtp服务器错误');
            }
            setTimeout(getWtp, 1800000)
        });

    }).on('error', function (e) {
            console.error(e);
            setTimeout(getWtp, 1800000)
        });
}

getWtp();

exports.index = function (req, res) {
    res.render('index', {
            title: '前端业务日志',
            isLogin: require('./login').isLogin(req),
            date: new Date(),
            username: req.session.username,
            sessionID: req.sessionID,
            wtp: exports.wtp
        }
    )

};
