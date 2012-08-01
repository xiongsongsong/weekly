/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-26
 * Time: 下午8:08
 * 备份数据库
 */

var exec = require('child_process').exec;

exports.dump = function (req, res) {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.write('开始备份数据库');
    var date = new Date();
    exec('mongodump -d fed -o ~/Ubuntu\\ One/Database/' +
        date.getFullYear() + '_' +
        (date.getMonth() + 1) + '_' +
        date.getDate() + '_' +
        date.getHours() + '_' +
        date.getMinutes(), function (err, stdout) {
        if (err) {
            res.end(err);
        } else {
            res.end('Success!\t' + Date.now() + '\n' + stdout);
        }
    });
};
