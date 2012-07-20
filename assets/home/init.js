/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-11
 * Time: 下午1:38
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
    alias:{
        'calendar':'/home/calendar.js',
        'record-log':'/home/record-log.js'
    }
});

define([ 'calendar', 'record-log'], function (require) {

    /*TODO：使用本地时间是否合理*/
    require('calendar').init(new Date());

    /*写工作日志 */
    require('record-log').init();

});
