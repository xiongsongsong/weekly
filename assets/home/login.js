/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-2-26
 * Time: 下午1:43
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    alias: {
        'jquery': '/global/jquery',
        'sha512': '/crypto/sha',
        'show-log': '/home/show-log'
    }
});

define(function (require, exports, module) {
    var showLog = require('show-log');
    var $ = require('jquery');
    var $loginFormObj = $(document.forms['login']);
    var $formObj = $(document.forms['add-record-log']);
    var JRecordLog = $('.J-record-log,.J-edit');
    var sha = require('sha512');


    $loginFormObj.submit(function (ev) {
        $.ajax('/login', {
            type: 'post',
            dataType: 'json',
            data: {
                user: $loginFormObj[0].elements['user'].value,
                pwd: sha.hex_sha512($loginFormObj[0].elements['pwd'].value)
            },
            cache: false,
            success: function (data) {
                if (data.code === 1) {
                    $loginFormObj.hide();
                    $formObj.show();
                    $formObj.add($loginFormObj).filter(':visible')[0].elements[0].select();
                    showLog.getData({
                        callback: function () {
                            showLog.resetDescribe();
                        }
                    });
                    $('#record-log').append('<span>（' + $loginFormObj[0].elements['user'].value + '）</span>');
                    JRecordLog.after('<li class="separator"></li><li><li><a href="#" class="change-pwd">改密</a>|<a href="log-out">退出登陆</a></li>')
                } else {
                    alert('用户名或密码错误')
                }
            }
        });
        ev.preventDefault();
    })


    /*改密码*/

    $('#sidebar-group').on('click', 'a.change-pwd', function (ev) {
        ev.preventDefault();
        var $this = $(ev.target);
        var $editPwd = $this.parents('ul').find('li.J-edit-pwd');
        if ($editPwd.size() > 0) {
            $editPwd.remove();
            return;
        }
        var li = $this.parents('li');
        li.after($('<li class="J-edit-pwd"><span class="tips">请输入当前密码：</span><input type="password" id="current-pwd">' +
            '<span class="tips">新密码：</span>' +
            '<input type="password" id="new-pwd1">' +
            '<span class="tips">重复一次：</span>' +
            '<input type="password" id="new-pwd2"><input type="button" class="J-submit" value="确认修改"></li>'))
    });


    $('#sidebar-group').on('click', 'input.J-submit', function (ev) {
        var currentPwd = $('#current-pwd').val();
        var newPwd1 = $('#new-pwd1').val();
        var newPwd2 = $('#new-pwd2').val();

        var $this = $(ev.target);
        var $editPwd = $this.parents('ul').find('li.J-edit-pwd');
        if (newPwd1 !== newPwd2) {
            alert('新密码不一致');
            return;
        }
        $.ajax('/change-pwd', {
            type: 'post',
            dataType: 'json',
            data: {
                a: sha.hex_sha512(currentPwd),
                b: sha.hex_sha512(newPwd1)
            },
            cache: false,
            success: function (data) {
                switch (data.code) {
                    case 1:
                        alert('修改成功')
                        $editPwd.remove();
                        break;
                    case -1:
                        alert('新密码格式不正确')
                        break;
                    case -5:
                        alert('原始密码不正确')
                        break;
                    case -4:
                        alert('无法找到该用户')
                        break;
                }
            }
        });
    });
})
