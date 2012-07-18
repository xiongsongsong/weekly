/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-11
 * Time: 下午1:38
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
    alias:{
        'jquery':'/global/jquery.js',
        'calendar':'/home/calendar.js',
        'record-log':'/home/record-log.js',
        'show-log':'/home/show-log.js'
    }
});


define(['jquery', 'calendar', 'record-log', 'show-log'], function (require) {

    var $ = require('jquery');

    /*日历控件*/
    var calendar = require('calendar');
    var showLog = require('show-log');

    calendar.init(new Date(), {
        onSwitch:showLog.init
    });

    /*写工作日志*/
    require('record-log').init({
        onUpdate:showLog.init
    });

    /*显示工作日志*/

    if (!typeof console) {
        window.console = {
            log:function (str) {
                document.status = str;
            }
        }
    }
});



