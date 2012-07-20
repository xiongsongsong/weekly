/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-7-15
 * Time: 下午5:22
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
    alias:{
        'jquery':'/global/jquery.js'
    }
});

define(function (require, exports, module) {
    var $ = require('jquery');

    exports.init = function (funcArr) {

        $.ajax('/show_log/json', {
            type:'get',
            cache:false,
            dataType:'json',
            data:{
                year:$('#year-trigger').text(),
                month:$('#month-trigger').text()
            },
            success:function (data) {
                $('#calendar-container').find('.work-diary').html('');
                $(data.documents).each(function (index, item) {
                    var id = '#date-' + item.year.toString() + item.month.toString() + item.date.toString();
                    var $content = $(id);
                    $content.find('.work-diary').append($('<span class="front front' + item.front + '" front="' + item.front + '">' + data.user['id_' + item.front] + '</span>'));
                });
                if (funcArr && funcArr.length > 0) exports.onSuccess(funcArr);
            }
        })
    };
    exports.onSuccess = function (funcArr) {
        for (var _i = 0; _i < funcArr.length; _i++) {
            funcArr[_i]();
        }
    };
});

