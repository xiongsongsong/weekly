/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-14
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
    alias:{
        'jquery':'/global/jquery.js'
    }
});
define(function (require, exports, module) {

    var $ = require('jquery');
    var $addRecordLog = $('#add-record-log');
    var left = parseInt($addRecordLog.css('left'), 10);

    exports.init = function () {
        $('.J-record-log').live('click', function (ev) {
            $addRecordLog.stop();
            $addRecordLog.animate({left:'0px'}, 500, function () {
                $addRecordLog[0].elements[0].focus();
            });
            $(ev.currentTarget).addClass('current');
        });
        $('#hidden-form').click(function () {
            $addRecordLog.stop();
            $addRecordLog.animate({left:left + 'px'}, 500, function () {
                $('.J-record-log').removeClass('current')
            });
        })
    };
    exports.init();
});