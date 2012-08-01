/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-1
 * Time: 下午3:25
 * 每天12点、00点自动备份数据库
 */


var cl = setInterval(timer, 1000);

function timer() {
    if ([0, 12].indexOf(new Date().getHours()) > -1) {
        clearInterval(cl);
        intervalDump();
    }
}

function intervalDump() {
    setInterval(require('./dump').dump, 43200000);
}
