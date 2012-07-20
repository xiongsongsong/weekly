/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-19
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    alias:{
        'jquery':'/global/jquery.js'
    }
});

define(['jquery'], function (require, exports, module) {
    var $ = require('jquery');

    exports.init = function () {
        var $frontObj = $('ul.user-filter span.front');
        $frontObj.live('click', function (ev) {
            var $target = $(ev.currentTarget);
            if ($target.hasClass('show-all')) {
                $frontObj.removeClass('weak highlight', 1);
            } else {
                $('ul.user-filter span.front').removeClass('highlight').addClass('weak');
                $target.removeClass('weak').addClass('highlight');
            }
            exports.filterData();
        });
    };

    exports.filterData = function () {
        var $frontObj = $('ul.user-filter span.front');
        var $calendarWrapper = $('#calendar-wrapper');
        var $target = $frontObj.filter('.highlight');
        if ($target.size() > 0) {
            var front = $target.attr('front');
            $calendarWrapper.find('span.front').hide();
            $calendarWrapper.find('.front' + front).each(function (index, item) {
                setTimeout(function () {
                    $(item).fadeIn(300)
                }, index * 42)
            });
        } else {
            $calendarWrapper.find('span.front').show();
        }
    };

    exports.init();
});