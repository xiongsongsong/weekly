/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-14
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */

"use strict";

seajs.config({
    alias:{
        'jquery':'/global/jquery',
        'show-log':'/home/show-log'
    }
});

define(function (require, exports, module) {
    var $ = require('jquery');
    var $addRecordLog = $('#add-record-log');
    var $formObj = $(document.forms['add-record-log']);
    var ele = $formObj[0].elements;
    var $loginFormObj = $(document.forms['login']);
    var left = -480;
    var JRecordLog = $('.J-record-log,.J-edit');

    exports.init = function () {
        JRecordLog.live('click', function (ev) {
            var $target = $(ev.currentTarget);
            if ($target.hasClass('J-edit')) {
                var id = $target.attr('data-id');
                $formObj.find('.J-temp').remove();
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
                ele['smt'].value = '确定修改';

                $formObj.find('tr:first').before('<tr class="J-temp"><td colspan="2" style="text-align: center;">正在修改JSON页面</td></tr>');
                $formObj.append($('<input type="hidden" name="type" value="edit" class="J-temp">'));
                $formObj.append($('<input type="hidden" name="object_id" value="' + id + '" class="J-temp">'));
            }

            $addRecordLog.stop();
            $addRecordLog.animate({left:'0px'}, 500);
            $(ev.currentTarget).addClass('current');
            if ($formObj.size() > 0) {
                $formObj.add($loginFormObj).filter(':visible')[0].elements[0].select();
            }
        });

        $('input.hidden-form').live('click', function () {
            $addRecordLog.stop();
            $addRecordLog.animate({left:left + 'px'}, 500, function () {
                JRecordLog.removeClass('current')
            });
        });

        $formObj.submit(function (ev) {
            saveLog();
            ev.preventDefault();
        });

        function saveLog() {
            var formData = $formObj.serialize();
            $.ajax('/save-log', {
                type:'post',
                dataType:'json',
                data:formData,
                cache:false,
                success:function (data) {
                    if (data.status) {
                        $formObj[0].reset();
                        $addRecordLog.animate({left:left + 'px'}, 500, function () {
                            JRecordLog.removeClass('current')
                        });
                        require('show-log').getData();
                        require('show-log').resetDescribe();
                    } else {
                        console.log(data);
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

        $loginFormObj.submit(function (ev) {
            $.ajax('/login', {
                type:'post',
                dataType:'json',
                data:$loginFormObj.serialize(),
                cache:false,
                success:function (data) {
                    if (data.status === true) {
                        $loginFormObj.hide();
                        $formObj.show();
                        $formObj.add($loginFormObj).filter(':visible')[0].elements[0].select();
                        $('#record-log').append('<span>（' + $loginFormObj[0].elements['user'].value + '）</span>');
                        JRecordLog.after('<li class="separator"></li><li><a href="log-out">退出登陆</a></li>')
                    } else {
                        alert('用户名或密码不正确。');
                    }
                }
            });
            ev.preventDefault();
        })
    };
});