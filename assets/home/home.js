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
        'record-log':'/home/record-log.js'
    }
});
define('home', ['jquery', 'calendar', 'record-log'], function (require) {

    var $ = require('jquery');

    /*日历控件*/
    var calendar = require('calendar');
    calendar.init(new Date());

    /*写工作日志*/
    require('record-log');



    if (!window.console) {
        window.console = {
            log:function (str) {
                document.status = str;
            }
        }
    }
});



