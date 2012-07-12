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
        currentDate.setMonth(4)
        var table = '<table>' +
            '<thead>' +
            '<tr class="th">' +
            '<th class="weekend">日</th>' +
            '<th height="40">一</th>' +
            '<th height="40">二</th>' +
            '<th height="40">三</th>' +
            '<th height="40">四</th>' +
            '<th height="40">五</th>' +
            '<th height="40" class="weekend">六</th>' +
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
        var calendarStr = [], _current;
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

        $('#date').html(currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate());
        $('#calendar-content').html(table + calendarStr.join(''));
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
    }
});