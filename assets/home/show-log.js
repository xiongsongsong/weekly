/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-7-15
 * Time: 下午5:22
 * 显示工作日志，并提供过滤，查看详情和简单统计等功能
 */
seajs.config({
    alias:{
        'jquery':'/global/jquery'
    }
});


define(function (require, exports, module) {
    var $ = require('jquery');

    /*初始化并显示数据*/
    var jsonData;
    var moreDetailWrapper = $('#more-detail-wrapper');
    exports.getData = function () {
        $.ajax('/show_log/json', {
            type:'get',
            cache:false,
            dataType:'text',
            data:{
                year:$('#year-trigger').text(),
                month:$('#month-trigger').text()
            },
            success:function (data) {
                jsonData = KISSY.JSON.parse(data);
                data = jsonData;
                $('#calendar-container').find('.work-diary').html('');
                $(data.documents).each(function (index, item) {
                    var id = '#date-' + item.year.toString() + item.month.toString() + item.date.toString();
                    var $content = $(id);
                    $content.find('.work-diary').append($('<span class="front front' + item.front + '" front="' + item.front + '">' + data.user['id_' + item.front].name + '</span>'));
                });
                exports.filterData();
                require('home/calendar.js').autoResetOffset();
            }
        })
    };

    /*添加事件，让用户可点击*/
    exports.filterEvent = function () {
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
        $('#statistics a.J-show-more').live('click', function () {
            exports.filterLogList();
            moreDetailWrapper.show();
            moreDetailWrapper.scrollTop(0);
            moreDetailWrapper.height($('#calendar-wrapper').height());
            $('#log-list-control').show();
        });

        $('#log-list-control .J-close').click(function () {
            $('#more-detail-wrapper').hide();
            $('#log-list-control').hide();
        });
        $(document).bind('keydown', function (ev) {
            if (ev.keyCode === 113) {
                $(document.body).toggleClass('show-amortization');

            }
        })
    };

    exports.getCurrentFilterOfFront = function () {
        var $frontObj = $('ul.user-filter span.front');
        return parseInt($frontObj.filter('.highlight').attr('front'), 10);
    };

    /*根据条件过滤数据*/
    exports.filterData = function () {
        var $frontObj = $('ul.user-filter span.front');
        var $calendarWrapper = $('#calendar-wrapper');
        var $target = $frontObj.filter('.highlight');
        if ($target.size() > 0) {
            var front = exports.getCurrentFilterOfFront();
            $calendarWrapper.find('span.front').hide();
            $calendarWrapper.find('.front' + front).each(function (index, item) {
                $(item).show()
            });
        } else {
            $calendarWrapper.find('span.front').show();
        }
        exports.filterLogList();
    };

    /*显示不同用户的页面记录*/
    exports.filterLogList = function () {
        if (jsonData == undefined)return;
        var moreDetail = $('#more-detail');
        var front = exports.getCurrentFilterOfFront();
        var html = [];
        KISSY.each(jsonData.documents, function (item, index) {
            if (isNaN(front)) {
                html.push(item)
            } else {
                if (item.front === front) {
                    html.push(item)
                }
            }
        });
        var htmlStr = [];
        var count = {
            level1:0,
            level2:0,
            level3:0,
            level4:0
        };
        if (html.length > 0) {
            KISSY.each(html, function (item) {
                count['level' + item.level]++;
                var str = '<h2><a href="' + $.trim(item['online-url']) + '" target="_blank">' + item['page-name'] + '</a></h2>' +
                    '<ul>' +
                    (function () {
                        return $.trim(item['online-url']).length > 0 ? '<li>线上地址：' + item['online-url'] + '</a></li>' : '';
                    })() +
                    (function () {
                        return $.trim(item['tms-url']).length > 0 ? '<li>TMS地址：<a href="' + $.trim(item['tms-url']) + '" target="_blank">' + item['tms-url'] + '</a></li>' : '';
                    })() +
                    (function () {
                        return isNaN(front) ? '<li>前端：' + jsonData.user['id_' + item['front']]['name'] + '</li>' : '';
                    })() +
                    (function () {
                        return $.trim(item['design']).length > 0 ? '<li>设计师：' + item['design'] + '</li>' : '';
                    })() +
                    (function () {
                        return $.trim(item['customer']).length > 0 ? '<li>需求方：' + item['customer'] + '</li>' : '';
                    })() +
                    (function () {
                        return '<li>页面等级：' + ['简单', '一般', '常规', '复杂'][item.level - 1] + '</li>';
                    })() +
                    '<li>完成日期：' + item['year'] + '-' + item['month'] + '-' + item['date'] + '</li>' +
                    (function () {
                        return $.trim(item['note']).length > 0 ? '<li>备注：' + item['note'] + '</li>' : '';
                    })() +
                    '</ul>';
                htmlStr.push(str);
            });
        } else {
            htmlStr.push('<h2>没有该月的记录</h2>')
        }
        moreDetail.html(htmlStr.join(''));
        var currentUser = jsonData.user['id_' + front];
        var amortization = count.level1 * 20 + count.level2 * 30 + count.level3 * 50 + count.level4 * 100;
        if (isNaN(front)) {
            $('#log-list-control .J-username').html('全部页面');
        } else {
            $('#log-list-control .J-username').html(currentUser.name + '（' + currentUser['real-name'] + '）');
        }
        $('#statistics').html('<h2>' + (function () {
            if (!isNaN(front)) {
                return '' + currentUser['name'] + ' - <span>' + currentUser['real-name'] + '</span>';
            } else {
                return '统计 ';
            }
        })() + '<span>（' + html.length + '）</span></h2>' +
            '<ul>' +
            '<li><span>简单：' + count.level1 + '</span><span>一般：' + count.level2 + '</span></li>' +
            '<li><span>常规：' + count.level3 + '</span><span>复杂：' + count.level4 + '</span></li>' +
            '<li>' +
            '<span class="amortization">￥' + amortization + '</span>' +

            '<span><a class="J-show-more show-more">查看详情 &gt;&gt;</a></span></li>' +
            '<li>' +
            '<span style="width:100%;" class="download-csv">' + (function () {
            var date = new Date();
            date.setTime(jsonData.serverDate);
            var year = parseInt($('#year-trigger').text(), 10);
            var month = parseInt($('#month-trigger').text(), 10);
            if (year <= date.getFullYear() && month <= date.getMonth() + 1) {
                return '<a href="/csv/' + year + '/' + month + '">下载' + year + '年' + month + '月报表</a>'
            } else {
                return '';
            }
        })() + '</span>' +
            '</li>' +
            '</ul>');
        moreDetailWrapper.scrollTop(0);
    };

    exports.filterEvent();

});

