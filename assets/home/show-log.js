/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-7-15
 * Time: 下午5:22
 * 显示工作日志，并提供过滤，查看详情和简单统计等功能
 */
seajs.config({
    alias:{
        'jquery':'/global/jquery',
        'render-log':'/home/render-log'
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
                exports.jsonData = jsonData;
                $('#calendar-container').find('.work-diary-list').html('');
                $(data.documents).each(function (index, item) {
                    var id = '#date-' + item.year.toString() + item.month.toString() + item.date.toString();
                    var $content = $(id);
                    $content.find('.work-diary-list').append($('<span class="front front' + item.front + '" front="' + item.front + '" data-id="' + item._id + '">' + beautifyName(data.user['id_' + item.front].name) + '</span>'));
                });
                exports.front = exports.getCurrentFilterOfFront();
                exports.updateUserList();
                exports.checkedFront();
                exports.filterData();
                exports.filterLogList();
            }
        })
    };


    exports.checkedFront = function () {
        exports.front = parseInt(exports.front, 10);
        var $target = $('ul.user-filter span.front' + exports.front);
        var $frontObj = $('ul.user-filter span.front');
        if ($target.hasClass('show-all') || $target.size() < 1) {
            $frontObj.removeClass('weak highlight', 1);
        } else {
            $('ul.user-filter span.front').removeClass('highlight').addClass('weak');
            $target.removeClass('weak').addClass('highlight');
        }
    };

    /*添加事件，让用户可点击*/
    function filterEvent() {
        $('ul.user-filter span.front').live('mousedown', function (ev) {
            exports.front = $(ev.target).attr('front');
            exports.checkedFront();
            exports.filterData();
            exports.filterLogList();
        });
        $('#statistics a.J-show-more').live('mousedown', function () {
            exports.filterLogList();
            moreDetailWrapper.show();
            moreDetailWrapper.scrollTop(0);
            moreDetailWrapper.height($('#calendar-wrapper').height());
            $('#log-list-control').show();
        });

        $('#log-list-control .J-close').mousedown(function () {
            $('#more-detail-wrapper').hide();
            $('#log-list-control').hide();
        });
        $(document).bind('keydown', function (ev) {
            if (ev.target.nodeName !== 'INPUT') {
                switch (ev.keyCode) {
                    case 113:
                        $(document.body).toggleClass('show-amortization');
                        break;
                    case 27:
                        exports.front = null;
                        exports.resetDescribe();
                        exports.checkedFront();
                        exports.filterData();
                        break;
                }
            }
        });

        //复位日历框为初始状态
        exports.resetDescribe = function () {
            $('#calendar-panel div.work-diary-list').stop().animate({top:0}, 300);
            $('#calendar-panel div.work-describe').remove();
        };

        $('ul.user-filter span.front').live('mousedown', exports.resetDescribe);

        $('#calendar-panel').mousedown(function (ev) {
            var t = $(ev.target);
            if (!(t.hasClass('front') || t.hasClass('work-describe') || t.parents('.work-describe').size() > 0)) {
                exports.resetDescribe();
            }
        });


        $('#calendar-panel span.front').live('mousedown', function (ev) {
            var target = $(ev.target);
            exports.front = target.attr('front');
            var parentsNode = target.parents('div.work-diary');
            $('#calendar-panel div.work-describe').remove();
            $('#calendar-panel div.work-diary-list').stop().not(parentsNode.find('div.work-diary-list')).animate({top:0}, 300);
            var _id = target.attr('data-id');
            var data;
            for (var i = 0; i < jsonData.documents.length; i++) {
                if (jsonData.documents[i]._id === _id) {
                    data = jsonData.documents[i];
                    break;
                }
            }
            var id = 'tempNode' + new Date().getTime() + '' + parseInt(Math.random() * 1000000, 10);

            var tempContainer = parentsNode[0].cloneNode(false);
            tempContainer.id = id;
            tempContainer.className += ' work-describe';

            tempContainer.innerHTML = '<ul>' + require('render-log').workDescribe(data, _id).join('') + '</ul>';
            parentsNode.append(tempContainer);
            tempContainer = $('#' + id);
            var workDiaryList = parentsNode.find('div.work-diary-list');
            exports.checkedFront();
            exports.filterData();
            exports.filterLogList();
            $(workDiaryList).animate({top:-workDiaryList.height() + 'px'}, 300);
            tempContainer.css({'border':'solid 1px ' + target.css('background-color')});
        });

        var cl;
        $(window).resize(function () {
            if (cl !== undefined) {
                clearTimeout(cl);
            }
            cl = setTimeout(function () {
                var workDiaryList = $('#calendar-panel div.work-describe').siblings('.work-diary-list');
                $(workDiaryList).stop().animate({top:-workDiaryList.height() + 'px'}, 300);
            }, 300);
        })

    }

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
            $calendarWrapper.find('span.front').hide();
            $calendarWrapper.find('.front' + exports.front).each(function (index, item) {
                $(item).show()
            });
        } else {
            $calendarWrapper.find('span.front').show();
        }
    };

    /*显示不同用户的页面记录*/
    exports.filterLogList = function () {
        if (jsonData == undefined)return;
        var moreDetail = $('#more-detail');
        var logList = require('render-log').logList();
        moreDetail.html(logList.list.join(''));
        var currentUser = jsonData.user['id_' + exports.front];
        var count = logList.count;
        var amortization = count.level1 * 20 + count.level2 * 30 + count.level3 * 50 + count.level4 * 100;
        if (isNaN(exports.front)) {
            $('#log-list-control .J-username').html('全部页面');
        } else {
            $('#log-list-control .J-username').html(beautifyName(currentUser.name) + '（' + currentUser['real-name'] + '）');
        }
        $('#statistics').html('<h2>' + (function () {
            if (!isNaN(exports.front)) {
                return '' + beautifyName(currentUser['name']) + ' - <span>' + currentUser['real-name'] + '</span>';
            } else {
                return '统计 ';
            }
        })() + '<span>（' + logList.length + '）</span></h2>' +
            '<ul>' +
            '<li><span>简单：' + count.level1 + '</span><span>一般：' + count.level2 + '</span></li>' +
            '<li><span>常规：' + count.level3 + '</span><span>复杂：' + count.level4 + '</span></li>' +
            '<li>' +
            '<span class="amortization">￥' + amortization + '</span>' +

            '<span><a class="J-show-more show-more">查看详情 &gt;&gt;</a></span></li>' +
            '<li>' +
            '<span style="width:100%;" class="download-csv">' + (function () {
            var year = parseInt($('#year-trigger').text(), 10);
            var month = parseInt($('#month-trigger').text(), 10);
            return '<a href="/csv/' + year + '/' + month + '">下载' + year + '年' + month + '月报表</a>'
        })() + '</span>' +
            '</li>' +
            '</ul>');
        moreDetailWrapper.scrollTop(0);
    };

    /*填充用户列表*/
    exports.updateUserList = function () {
        var userFilterContainer = $('#user-filter-container');
        var str = [];
        for (var a in jsonData.user) {
            if (jsonData.user.hasOwnProperty(a)) {
                str.push('<span class="front front' + jsonData.user[a].id + '" front="' + jsonData.user[a].id + '">' + beautifyName(jsonData.user[a].name) + '</span>');
            }
        }
        str.push('<span class="front show-all">所有 ESC</span>');
        userFilterContainer.html(str.join(''));
    };

    //尝试过滤花名中的非中文字符
    function beautifyName(name) {
        var _name = name.match(/[\u4E00-\u9FA5]+/);
        if (_name && _name.length > 0 && _name[0].length > 1) {
            return _name[0].substring(0, 2);
        } else {
            return name.substring(0, 3) + '..';
        }

    }

    filterEvent();

});

