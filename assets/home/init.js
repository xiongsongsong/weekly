/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-11
 * Time: 下午1:38
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    alias:{
        'calendar':'/home/calendar',
        'record-log':'/home/record-log'
    }
});

seajs.config({
        map:[
            [/(.*\.(css|js))(?:.*)$/i, "$1?201284.$2"]
        ]
    }
);

define([ 'calendar', 'record-log'], function (require) {

    if (KISSY.UA.ie && KISSY.UA.ie === 6) {
        alert('哎呀，\r\n\r\n您使用的浏览器非常老旧，\r\n\r\n本页面可能会运行不正常，祝你好运！\r\n' +
            '\r\n如果页面错误，请按F5刷新。')
    }

    /*构造日历界面*/
    require('calendar').init();

    /*写工作日志 */
    require('record-log').init();

});
