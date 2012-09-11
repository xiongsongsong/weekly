/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-9-11
 * Time: 上午11:55
 * 生成渲染后的html
 */

"use strict";

seajs.config({
    alias:{
        'jquery':'/global/jquery',
        'show-log':'/home/show-log'
    }
});

define(function (require, exports, module) {
    var showLog = require('show-log');
    var $ = require('jquery');

    exports.logList = function () {
        var jsonData = showLog.jsonData;
        var html = [];
        var front = require('show-log').front;
        KISSY.each(jsonData.documents, function (item) {
            if (isNaN(front)) {
                html.push(item)
            } else {
                if (item.front === front) {
                    html.push(item)
                }
            }
        });

        var list = [];
        var count = {
            level1:0,
            level2:0,
            level3:0,
            level4:0
        };
        if (html.length > 0) {
            KISSY.each(html, function (item) {
                count['level' + item.level]++;
                var str = '<h2>' + (function () {
                    if ($.trim(item['online-url']).length > 0) {
                        return '<a href="' + $.trim(item['online-url']) + '" target="_blank">' + item['page-name'] + '</a>';
                    } else {
                        return  item['page-name'];
                    }
                })() + '</h2>' +
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
                list.push(str);
            });
        } else {
            list.push('<h2>没有该月的记录</h2>')
        }
        return {
            list:list,
            count:count,
            length:html.length
        };
    };

    exports.workDescribe = function (data, _id) {
        var jsonData = showLog.jsonData;
        return [
            (function () {
                var level = ['【简单】', '【一般】', '【常规】', '【复杂】'][data['level'] - 1];
                return '<li title="' + level + data['page-name'] + '">' +
                    (function () {
                        return $.trim(data['online-url']).length > 1 ?
                            '<a href="' + data['online-url'] + '" target="_blank">' + data['page-name'] + '</a>'
                            : data['page-name'];
                    })() +
                    '</li>';
            })(),
            (function () {
                var str = '';
                data['design'].length >= 1 ? str += '设计:' + data['design'] + ' ' : '';
                data['customer'].length >= 1 ? str += '需求:' + data['customer'] : '';
                return str.length > 1 ? '<li title="' + str + '">' + str + '</li>' : '';
            })(),
            (function () {
                var str = '';
                data['tms-url'].length >= 1 ? str += '<a href="' + data['tms-url'] + '" target="_blank">TMS地址</a>' : '';
                return str.length > 1 ? '<li>' + str + '</li>' : '';
            })(),
            (function () {
                //如果登陆用户，并且是当前条目拥有者，则显示编辑按钮
                if (jsonData.userid && jsonData.userid === data['front']) {
                    return '<li class="edit"><b class="J-edit" data-id="' + _id + '">编辑</li>';
                }
            })()
        ];
    }
});
