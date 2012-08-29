/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-26
 * Time: 下午8:08
 * 备份数据库
 */

var exec = require('child_process').exec;

exports.dump = function (req) {
    var date = new Date();
    var username = req.session.username;
    exec('mongodump -d fed -o ~/Ubuntu\\ One/Database/' +
        date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + '-' +
        date.getHours() + '-' +
        date.getMinutes() + '-' +
        date.getSeconds() + '-' +
        date.getMilliseconds() +'_of_'+ username, function (err, stdout) {
        if (err) {
            console.log(err);
        } else {
            console.log('Backup database success!'+ username +'\t'+new Date().toLocaleTimeString());
        }
    });
};
