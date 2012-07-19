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
    var $formObj = $(document.forms['add-record-log']);
    var $loginFormObj = $(document.forms['login']);
    var left = -480;

    exports.init = function (param) {
        $('.J-record-log').live('click', function (ev) {
            $addRecordLog.stop();
            $addRecordLog.animate({left:'0px'}, 500);
            $(ev.currentTarget).addClass('current');
            $formObj.add($loginFormObj).filter(':visible')[0].elements[0].select();
        });

        $('input.hidden-form').live('click', function () {
            $addRecordLog.stop();
            $addRecordLog.animate({left:left + 'px'}, 500, function () {
                $('.J-record-log').removeClass('current')
            });
        });

        $formObj.submit(function (ev) {
            var formData = $formObj.serialize();
            $.ajax('/save-log', {
                type:'post',
                dataType:'json',
                data:formData,
                cache:false,
                success:function (data) {
                    if (data.status && param.onUpdate) {
                        param.onUpdate();
                        $formObj[0].reset();
                        $addRecordLog.animate({left:left + 'px'}, 500, function () {
                            $('.J-record-log').removeClass('current')
                        });
                    } else {
                        alert('有错误！\r\n' + KISSY.JSON.stringify(data,undefined,'\t'));
                    }
                }
            });

            ev.preventDefault();
        });

        $loginFormObj.submit(function (ev) {
            $.ajax('/login', {
                type:'post',
                dataType:'json',
                data:$loginFormObj.serialize(),
                cache:false,
                success:function (data) {
                    if (data.status) {
                        $loginFormObj.hide();
                        $formObj.show();
                        $formObj.add($loginFormObj).filter(':visible')[0].elements[0].select();
                        $('#record-log').append('<span>（' + data.user + '）</span>')
                    } else {
                        alert('啊哦，登陆遇到错误\r\n' + KISSY.JSON.stringify(data))
                    }
                }
            });
            ev.preventDefault();
        })
    };
});