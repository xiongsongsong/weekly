/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-26
 * Time: 下午8:08
 * 备份数据库
 */

var exec = require('child_process').exec;

exports.dump = function (req, res) {
    req !== undefined ? res.header('Content-Type', 'text/plain; charset=utf-8') : undefined;
    req !== undefined ? res.write('开始备份数据库\r\n\r\n') : undefined;
    var date = new Date();
    exec('mongodump -d fed -o ~/Ubuntu\\ One/Database/' +
        date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + '-' +
        date.getHours() + ' ' +
        date.getMinutes() + '-' +
        date.getSeconds() + '-' +
        date.getMilliseconds() + (function () {
        return req.session.username ? req.session.username : '手动备份';
    }), function (err, stdout) {
        if (err) {
            res !== undefined ? res.end(err.toString()) : console.log(err);
        } else {
            res !== undefined ? res.end('Success!\r\n\r\n\t' + Date.now() + '\n' + stdout) : console.log(stdout);
        }
    });
};
