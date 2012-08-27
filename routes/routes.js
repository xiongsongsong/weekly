/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:06
 * To change this template use File | Settings | File Templates.
 */

exports.init = function (app) {

    var mongodb = require('mongodb');
    var server = new mongodb.Server("127.0.0.1", 27017, {});
    var fed = new mongodb.Db('fed', server, {});

    exports.open = function () {
        fed.open(function (error, client) {
            init(app, client)
        });
    };

    fed.on('close', function () {
        console.log('Database connection is disconnected!\t' + new Date().toLocaleTimeString());
    });

};

function init(app, client) {

//首页
    app.get('/', routes.index);

//保存日志
    app.post('/save-log', routes.save_log);

//拉取日志信息
    app.get('/show_log/:date', routes.show_log);

//登陆
    app.post(/login(\/)?.*/, routes.login);

//登出
    app.get('/log-out', routes.log_out);

//下载报表
    app.get('/csv/:year/:month/:format?', require('./csv').download);

//茶歇会的DEMO接口服务
    app.get('/demo/:which?', require('../helper/demo').init);

//备份数据库到Ubuntu One文件夹
    app.get('/mongodump', require('../helper/dump').dump);//首页

//保存日志
    app.post('/save-log', routes.save_log);

//拉取日志信息
    app.get('/show_log/:date', routes.show_log);

//登陆
    app.post(/login(\/)?.*/, routes.login);

//登出
    app.get('/log-out', routes.log_out);

//下载报表
    app.get('/csv/:year/:month/:format?', require('./csv').download);

//茶歇会的DEMO接口服务
    app.get('/demo/:which?', require('./../helper/demo').init);

//备份数据库到Ubuntu One文件夹
    app.get('/mongodump', require('./../helper/dump').dump);
}

