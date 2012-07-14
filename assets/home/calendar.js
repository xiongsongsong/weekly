/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-11
 * Time: 下午1:48
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    alias:{
        'jquery':'/global/jquery.js'
    }
});

define(function (require, exports, module) {
    var $ = require('jquery');
    exports.createTableView = function () {
        var currentDate = new Date();
        var table = '<table id="calendar-container">' +
            '<thead>' +
            '<tr class="th">' +
            '<th class="weekend">日</th>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th class="weekend">六</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';

        var prevMonthOfDate = (new Date());
        (function () {
            prevMonthOfDate.setTime(currentDate.getTime());
            prevMonthOfDate.setDate(1);
            if (currentDate.getMonth() == 0) {
                prevMonthOfDate.setMonth(11);
                prevMonthOfDate.setFullYear(currentDate.getFullYear() - 1);
            } else {
                prevMonthOfDate.setMonth(currentDate.getMonth() - 1);
            }
        })();

        var dateArr = [];
        var _tempDate = new Date();
        _tempDate.setTime(currentDate.getTime());
        _tempDate.setDate(1);
        var leftDate = _tempDate.getDay();

        var currentMaxDays = exports.getMaxDays(currentDate, currentDate.getMonth());
        var prevMaxDays = exports.getMaxDays(prevMonthOfDate, prevMonthOfDate.getMonth());

        for (var i = 0; i < leftDate; i++) {
            dateArr.push({type:'prev', date:prevMaxDays - i});
        }
        dateArr.reverse();

        for (i = 1; i < currentMaxDays + 1; i++) {
            dateArr.push({type:'current', date:i});
        }

        //获取月末是星期几
        _tempDate.setDate(currentMaxDays);
        for (i = 1; i <= 7 - _tempDate.getDay() - 1; i++) {
            dateArr.push({type:'next', date:i});
        }

        //补足月末的天数
        var calendarStr = [], _current = '';
        for (var j = 0; j < dateArr.length; j++) {
            switch (dateArr[j].type) {
                case "prev":
                    _current = ' class="prev"';
                    break;
                case "next":
                    _current = ' class="next"';
                    break;
            }
            if (j == 0 || (j + 1) % 7 == 1) {
                calendarStr.push('<tr>')
            }
            if ((j + 1) % 7 == 0 && j > 0) {
                calendarStr.push('<td' + _current + '><div class="wrapper"><b class="day">' + dateArr[j].date + '</b></div></td></tr>')
            } else {
                calendarStr.push('<td' + _current + '><div class="wrapper"><b class="day">' + dateArr[j].date + '</b></div></td>');
            }
            _current = '';
        }

        $('#date').html(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate());
        $('#calendar-wrapper').html(table + calendarStr.join(''));

        exports.autoResetOffset();
    };

    /*
     * 返回指定年、月份的最大当月天数
     * */
    exports.getMaxDays = function (date, month) {
        if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
            return 31;
        } else {
            return month == 1 ? date.getFullYear() % 4 == 0 ? 29 : 28 : 30;
        }
    };

    exports.autoResetOffset = function () {
        var tdObj = $('#calendar-container td');
        var trObj = $('#calendar-container tr');
        if (tdObj.size() > 0) {
            var sidebarObj = $('#sidebar-wrapper');
            var mainWrapper = $('#main-wrapper');

            $([sidebarObj, mainWrapper]).height(document.body.offsetHeight - $('#header').height() + 'px');
            mainWrapper.width(document.body.offsetWidth - sidebarObj[0].offsetWidth + 'px');

            var calendarWrapperHeight = mainWrapper[0].offsetHeight - $('#calendar-header').height();
            var calendarWrapperWidth = mainWrapper[0].offsetWidth;
            $('#calendar-wrapper').height(calendarWrapperHeight + 'px');

            $('#calendar-container').height(calendarWrapperHeight - 24 + 'px');
            $('#calendar-container').width(calendarWrapperWidth - 24 + 'px');


            var calendarContainerHeight = document.body.offsetHeight - $('#header').height() - $('#calendar-header').height() - 60 - 28;
            trObj.each(function (index, item) {
                if (index > 0) {
                    $(item).find('div.wrapper').height(parseInt(calendarContainerHeight / (trObj.size() - 1), 10) + 'px');
                } else {
                    $(item).height('60px')
                }
            });
        }
    };

    $(window).on('resize', function () {
        exports.autoResetOffset();
    });
});
