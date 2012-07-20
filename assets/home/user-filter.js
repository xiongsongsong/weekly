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
    var $calendarWrapper = $('#calendar-wrapper');
    exports.init = function () {
        var $frontObj = $('ul.user-filter span.front');
        $frontObj.live('click', function (ev) {
            var $target = $(ev.currentTarget);
            var front = $target.attr('front');
            if ($target.hasClass('show-all')) {
                $calendarWrapper.find('span.front').show();
                $frontObj.removeClass('weak highlight', 1);
            } else {
                $('ul.user-filter span.front').removeClass('highlight').addClass('weak');
                $target.removeClass('weak').addClass('highlight');
                $calendarWrapper.find('span.front').hide().siblings('span.front' + front).show();
            }
        });
    };

    exports.init();
});