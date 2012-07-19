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
    var currentDate;
    var S = KISSY, DOM = S.DOM, Event = S.Event,
        $yearNode = $('#year-trigger'),
        $monthNode = $('#month-trigger'), Param;

    /*通过鼠标滚轮修改时间*/
    Event.on([$yearNode[0], $monthNode[0]], "mousewheel", function (ev) {
        var year = parseInt($yearNode.html(), 10);
        var month = parseInt($monthNode.html(), 10);

        switch (ev.currentTarget.id) {
            case  "year-trigger":
                year = ev.deltaY > 0 ? year + 1 : year - 1;
                $yearNode.html(year);
                break;
            case "month-trigger":
                if (ev.deltaY > 0) {
                    month += 1;
                    if (month > 12) {
                        month = 1;
                        year += 1;
                    }
                } else {
                    month -= 1;
                    if (month < 1) {
                        month = 12;
                        year -= 1;
                    }
                }
                $yearNode.html(year);
                $monthNode.html(month);
                break;
        }
        //更新日历界面
        var _tempDate = new Date();
        _tempDate.setDate(1);
        _tempDate.setFullYear(year);
        _tempDate.setMonth(month - 1);
        currentDate = _tempDate;
        exports.createTableView();
        ev.preventDefault();
    });

    /*初始化日历界面*/
    exports.init = function (date, _config) {
        currentDate = date;
        Param = _config;
        exports.createTableView();
        $('#calendar-header').bind('selectstart', function (ev) {
            document.selection.clear();
            ev.preventDefault();
        });

        $('.J-scroll-date').click(function (ev) {
            ev.preventDefault();
        });

        if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
            $yearNode.add($monthNode).hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            })
        }
    };

    /*构造日历界面*/
    exports.createTableView = function () {
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

        var lastMonth = (new Date());
        (function () {
            lastMonth.setTime(currentDate.getTime());
            lastMonth.setDate(1);
            if (currentDate.getMonth() == 0) {
                lastMonth.setMonth(11);
                lastMonth.setFullYear(currentDate.getFullYear() - 1);
            } else {
                lastMonth.setMonth(currentDate.getMonth() - 1);
            }
        })();

        var nextMonth = (new Date());
        (function () {
            nextMonth.setTime(currentDate.getTime());
            nextMonth.setDate(1);
            if (currentDate.getMonth() == 11) {
                nextMonth.setMonth(0);
                nextMonth.setFullYear(currentDate.getFullYear() + 1);
            } else {
                nextMonth.setMonth(currentDate.getMonth() + 1);
            }
        })();

        var dateArr = [];
        var _tempDate = new Date();
        _tempDate.setTime(currentDate.getTime());
        _tempDate.setDate(1);
        var leftDate = _tempDate.getDay();

        var currentMaxDays = exports.getMaxDays(currentDate, currentDate.getMonth());
        var prevMaxDays = exports.getMaxDays(lastMonth, lastMonth.getMonth());

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
                    _current = ' class="prev" id="date-' + lastMonth.getFullYear() + (lastMonth.getMonth() + 1) + dateArr[j].date + '"';
                    break;
                case "next":
                    _current = ' class="next" id="date-' + nextMonth.getFullYear() + (nextMonth.getMonth() + 1) + dateArr[j].date + '"';
                    break;
                case "current":
                    _current = ' class="current" id="date-' + currentDate.getFullYear() + (currentDate.getMonth() + 1) + dateArr[j].date + '"';
                    break;
            }
            if (j == 0 || (j + 1) % 7 == 1) {
                calendarStr.push('<tr>')
            }
            if ((j + 1) % 7 == 0 && j > 0) {
                calendarStr.push('<td' + _current + '><div class="wrapper"><div class="work-diary"></div><b class="day">' + dateArr[j].date + '</b></div></td></tr>')
            } else {
                calendarStr.push('<td' + _current + '><div class="wrapper"><div class="work-diary"></div><b class="day">' + dateArr[j].date + '</b></div></td>');
            }
            _current = '';
        }

        $yearNode.html(currentDate.getFullYear());
        $monthNode.html(currentDate.getMonth() + 1);
        $('#calendar-wrapper').html(table + calendarStr.join(''));

        exports.autoResetOffset();

        if (Param !== undefined && Param.onSwitch) {
            Param.onSwitch();
        }
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

    /*上一月*/
    exports.prev = function () {
        currentDate.setDate(1);
        if (currentDate.getMonth() == 0) {
            currentDate.setMonth(11);
            currentDate.setFullYear(currentDate.getFullYear() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        exports.createTableView();
    };

    /*下一月*/
    exports.next = function () {
        currentDate.setDate(1);
        if (currentDate.getMonth() == 11) {
            currentDate.setMonth(0);
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        exports.createTableView();
    };

    /*调优日历界面*/
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
                }
            });
        }
    };

    $(window).on('resize', function () {
        exports.autoResetOffset();
    });
});
