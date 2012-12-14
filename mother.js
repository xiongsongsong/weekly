/**
 * Created with IntelliJ IDEA.
 * Date: 12-12-13
 * Time: 上午9:12
 * reference: http://php.js.cn/blog/nodejs-error-handling/
 */

start();

function start() {

    var spawn = require('child_process').spawn;
    var exec = require('child_process').exec;

    exec('echo "------------Mother process is running.' + (new Date()).toLocaleString() + '---------------" >>log.txt');

    var ls = spawn('node', ['app']);

    ls.stdout.on('data', function (data) {
        exec('echo "' + data.toString().replace(/[\r\n]/gmi, 'CLRF').replace(/['"]/gmi, '”') + '" >>log.txt"');
    });

    ls.stderr.on('data', function (data) {
        exec('echo "' + data.toString().replace(/[\r\n]/gmi, 'CLRF').replace(/['"]/gmi, '”') + '" >>log.txt"');
    });

    ls.on('exit', function (code) {
        exec('echo "child process exited with code ' + code + ',' + (new Date()).toLocaleString() + '"  >>log.txt');
        delete(ls);
        setTimeout(start, 5000);
    });

}
