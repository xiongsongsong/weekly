/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:26
 * To change this template use File | Settings | File Templates.
 */

'use strict';

exports.index = function (req, res) {
    res.render('index', {
            title: '前端业务日志',
            isLogin: require('./login').isLogin(req),
            date: new Date(),
            username: req.session.username,
            sessionID: req.sessionID
        }
    )

};
