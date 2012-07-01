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
        'calendar':'/home/calendar.js'
    }
});
define('home', ['jquery', 'calendar'], function (require) {
    var $ = require('jquery');
    require('calendar').createTableView();

    if (!window.console) {
        window.console = function () {

        };
    }
});



