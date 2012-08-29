/*
 * 主要的业务逻辑
 */


exports.init = function (app) {
    require('../helper/user').init();
    require('../helper/db').open({
        success:function () {
            console.log('数据库连接成功，开始启动路由');
            init(app);
        },
        error:function () {
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

//登陆
    app.post(/login(\/)?.*/, require('./login').login);

//登出
    app.get('/log-out', require('./login').log_out);

//下载报表
    app.get('/csv/:year/:month/:format?', require('./csv').download);

//茶歇会的DEMO接口服务
    app.get('/demo/:which?', require('../helper/demo').init);

//保存日志
    app.post('/save-log', require('./save-log').save_log);

//拉取日志信息
    app.get('/show_log/:date', require('./show-log').show_log);
}
