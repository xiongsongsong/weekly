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

    /*构造日历界面*/
    require('calendar').init();

    /*写工作日志 */
    require('record-log').init();

});
