/*
 * 主要的业务逻辑
 */

'use strict';

exports.init = function (app) {
    require('../helper/db').open({
        success: function () {
            require('../helper/user').updateFrontList();
            console.log('数据库连接成功，开始启动路由');
            init(app);
        },
        error: function () {
            console.log('请检查数据库是否启动');
        }
    });
};

function init(app) {
    //首页
    app.get('/', require('./home').index);

    //保存日志
    app.post('/save-log', require('./save-log').save_log);

    //拉取日志信息
    app.get('/show_log/:date', require('./save-log').show_log);

    app.get('/list/', function (req, res) {
        var DB = require('../helper/db');
        res.header('content-type', 'text/json;charset=utf-8');
        var collection = new DB.mongodb.Collection(DB.client, 'log');
        collection.find({ level: {'$gt': 0}}, {}).sort([
                ['front', 1]
            ]).toArray(function (err, docs) {
                res.end(JSON.stringify({data: docs}, undefined, '\t'))
            });

    });

    //登陆
    app.post(/login(\/)?.*/, require('./login').login);

    //登出
    app.get('/log-out', require('./login').log_out);

    //更改密码
    app.post('/change-pwd', require('./login').changePwd);

    //下载报表
    app.get('/csv/:year/:month/:format?', require('./csv').download);

    //茶歇会的DEMO接口服务
    app.get('/demo/:which?', require('../helper/demo').init);

    //保存日志
    app.post('/save-log', require('./save-log').save_log);

    //拉取日志信息
    app.get('/show_log/:date', require('./show-log').show_log);

    //拉取日志信息
    app.get('/show_log/:date', require('./show-log').show_log);

    app.get('/history', require('./history').history);

    //本地测试使用 获取用户列表
    app.get('/node/user-list', require('../helper/temp').tempUser);

    //本地测试使用 获取临时文件
    app.post('/node/check', require('../helper/temp').check);

}

