/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-11
 * Time: 下午1:38
 * To change this template use File | Settings | File Templates.
 */

"use strict";

seajs.config({
    alias:{
        'calendar':'/home/calendar',
        'record-log':'/home/record-log'
    }
});

seajs.config({
        map:[
            [/(.*\.(css|js))(?:.*)$/i, "$1?20120810.$2"]
        ]
    }
);

define([ 'calendar', 'record-log'], function (require) {

    /*构造日历界面*/
    require('calendar').init();

    /*写工作日志 */
    require('record-log').init();

    setTimeout(function () {
        KISSY.Anim(KISSY.get('#header span'),{top:'0'},1,'elasticOut').run();
    }, 500);

});
