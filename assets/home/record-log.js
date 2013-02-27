/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-14
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */

"use strict";

seajs.config({
    alias: {
        'jquery': '/global/jquery',
        'show-log': '/home/show-log'
    }
});

define(function (require, exports, module) {
    var $ = require('jquery');
    var $addRecordLog = $('#add-record-log');
    var showLog = require('show-log');
    var $formObj = $(document.forms['add-record-log']);
    var ele = $formObj[0] && $formObj[0].elements;
    var $loginFormObj = $(document.forms['login']);
    var left = -480;
    var JRecordLog = $('.J-record-log,.J-edit');

    exports.init = function () {
        JRecordLog.live('click', function (ev) {
            var $target = $(ev.currentTarget);
            if ($formObj[0]) {
                $formObj.find('.J-temp').remove();
                $formObj[0].reset();

                if ($target.hasClass('J-edit')) {
                    var id = $target.attr('data-id');
                    var currentDoc = undefined;
                    $(require('show-log').jsonData.documents).each(function (index, item) {
                        if (id === item._id) {
                            currentDoc = item;
                            return false;
                        }
                    });
                    if (currentDoc === undefined) return;
                    ele['page-name'].value = currentDoc['page-name'];
                    ele['design'].value = currentDoc['design'];
                    ele['customer'].value = currentDoc['customer'];
                    ele['level'].value = currentDoc['level'];
                    ele['online-url'].value = currentDoc['online-url'];
                    ele['tms-url'].value = currentDoc['tms-url'];
                    ele['note'].value = currentDoc['note'];
                    ele['year'].value = currentDoc['year'];
                    ele['month'].value = currentDoc['month'];
                    ele['date'].value = currentDoc['date'];
                    if (!ele['smt'].getAttribute('default-text')) ele['smt'].setAttribute('default-text', ele['smt'].value);
                    ele['smt'].value = '确定修改';

                    $formObj.find('tr:first').before('<tr class="J-temp"><td colspan="2" class="edit-log">修改：' + currentDoc['page-name'] + '</td></tr>');
                    $formObj.append($('<input type="hidden" name="type" value="edit" class="J-temp">'));
                    $formObj.append($('<input type="hidden" name="object_id" value="' + id + '" class="J-temp">'));
                    $('#more-detail-wrapper').addClass('edit');
                } else {
                    if (ele['smt'].getAttribute('default-text')) ele['smt'].value = ele['smt'].getAttribute('default-text');
                    $('#more-detail-wrapper').removeClass('edit');
                }
            }

            $addRecordLog.stop();
            $addRecordLog.animate({left: '0px'}, 500);
            $(ev.currentTarget).addClass('current');
            if ($formObj.size() > 0) {
                $formObj.add($loginFormObj).filter(':visible')[0].elements[0].select();
            }
        });

        $('input.hidden-form').live('click', function () {
            $('#more-detail-wrapper').removeClass('edit');
            $addRecordLog.stop();
            $addRecordLog.animate({left: left + 'px'}, 500, function () {
                JRecordLog.removeClass('current')
            });
        });

        $formObj.submit(function (ev) {
            saveLog();
            ev.preventDefault();
        });

        function saveLog() {
            $('#more-detail-wrapper').removeClass('edit');
            var formData = $formObj.serialize();
            $.ajax('/save-log', {
                type: 'post',
                dataType: 'json',
                data: formData,
                cache: false,
                success: function (data) {
                    if (data.status) {
                        $formObj[0].reset();
                        $addRecordLog.animate({left: left + 'px'}, 500, function () {
                            JRecordLog.removeClass('current')
                        });
                        //if it is in edit mode
                        if (ele['type'] && ele['type'].value === 'edit') {
                            showLog.getData({
                                callback: function () {
                                    showLog.updateCurrentInfo(ele['object_id'].value);
                                    showLog.updateDiaryList();
                                    var highLight = $('#calendar-panel span.front[data-id=' + ele['object_id'].value + ']');
                                    //如果在当月更新了日期，则跳转到指定日期，并高亮之
                                    if (highLight.size() > 0) {
                                        showLog.checkedFrontDaily({target: highLight});
                                    } else {
                                        //如果将日志更改到了非当前所切换月份，则重新过滤当前用户
                                        showLog.resetDescribe();
                                        showLog.checkedFront();
                                        showLog.filterData();
                                        showLog.filterLogList();
                                    }
                                    $formObj[0].reset();
                                    $formObj.find('.J-temp').remove();
                                }
                            });
                        } else {
                            showLog.getData({
                                callback: function () {
                                    showLog.updateDiaryList();
                                    showLog.updateUserList();
                                    showLog.checkedFront();
                                    showLog.filterData();
                                    showLog.filterLogList();
                                }
                            });
                        }
                    } else {
                        alert('有错误！\r\n\r\n' + KISSY.JSON.stringify(data, undefined, '   '));
                        for (var i = 0; i < data.errorList.length; i++) {
                            var obj = $formObj[0].elements[data.errorList[i].name];
                            if (obj) {
                                obj.focus();
                                break;
                            }
                        }
                    }
                }
            });
        }


    };
});
