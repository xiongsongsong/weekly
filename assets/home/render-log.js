/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-9-11
 * Time: 上午11:55
 * 生成渲染后的html
 */

"use strict";

seajs.config({
    alias: {
        'jquery': '/global/jquery',
        'show-log': '/home/show-log'
    }
});

define(function (require, exports, module) {
    var showLog = require('show-log');
    var $ = require('jquery');

    function createTpl(item, name) {
        var attr = 'class="J-' + name + '" data-id="' + item._id + '"';
        switch (name) {
            case 'page-name':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'front':
                return '<span ' + attr + '>' + showLog.jsonData.user['id_' + item['front']]['name'] + '</span>';
                break;
            case 'online-url':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'tms-url':
                return '<a href="' + item['tms-url'] + '" ' + attr + ' target="_blank">' + item['tms-url'] + '</a>';
                break;
            case 'design':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'customer':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'note':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'year':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'month':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
            case 'date':
                return '<span ' + attr + '>' + item[name] + '</span>';
                break;
        }
    }

    function isHidden(item, name) {
        return $.trim(item[name]).length < 1 ? ' class="hidden J-container"' : ' class="J-container"';
    }

    exports.logList = function () {
        var jsonData = showLog.jsonData;
        var html = [];
        var front = require('show-log').front;
        KISSY.each(jsonData.documents, function (item) {
            if (front) {
                if (item.front === front) html.push(item)
            } else {
                html.push(item)
            }
        });

        var list = [];
        var count = {
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0
        };
        if (html.length > 0) {
            KISSY.each(html, function (item) {
                count['level' + item.level]++;
                var date = new Date(item.completion_date);
                item.year = date.getFullYear();
                item.month = date.getMonth() + 1;
                item.date = date.getDate();
                var str = '<h2>' + (function () {
                    if ($.trim(item['online-url']).length > 0) {
                        return '<a href="' + $.trim(item['online-url']) + '" target="_blank">' + createTpl(item, 'page-name') + '</a>';
                    } else {
                        return  createTpl(item, 'page-name');
                    }
                })() + (function () {
                    //如果登陆用户，并且是当前条目拥有者，则显示编辑按钮
                    return jsonData.userid && jsonData.userid === item['front'] ? '<b class="J-edit edit" data-id="' + item._id + '">[编辑]</b>' : '';
                })() + '</h2>' +
                    '<ul>' +
                    (function () {
                        return '<li ' + isHidden(item, 'online-url') + '>线上地址：' + createTpl(item, 'online-url') + '</li>';
                    })() +
                    (function () {
                        return '<li ' + isHidden(item, 'tms-url') + '>TMS地址：' + createTpl(item, 'tms-url') + '</li>';
                    })() +
                    (function () {
                        return isNaN(front) ? '<li>前端：' + createTpl(item, 'front') + '</li>' : '';
                    })() +
                    (function () {
                        return  '<li ' + isHidden(item, 'design') + '>设计师：' + createTpl(item, 'design') + '</li>';
                    })() +
                    (function () {
                        return '<li ' + isHidden(item, 'customer') + '>需求方：' + createTpl(item, 'customer') + '</li>';
                    })() +
                    (function () {
                        return '<li>页面等级：' + ['简单', '一般', '常规', '复杂'][item.level - 1] + '</li>';
                    })() +
                    '<li>完成日期：' + createTpl(item, 'year') + '-' + createTpl(item, 'month') + '-' + createTpl(item, 'date') + '</li>' +
                    (function () {
                        return '<li ' + isHidden(item, 'note') + '>备注：' + createTpl(item, 'note') + '</li>';
                    })() +
                    '</ul>';
                list.push(str);
            });
        } else {
            list.push('<h2>没有该月的记录</h2>')
        }
        return {
            list: list,
            count: count,
            length: html.length
        };
    };

    exports.workDescribe = function (data, _id) {
        var jsonData = showLog.jsonData;
        return [
            (function () {
                return '<li>' +
                    (function () {
                        return $.trim(data['online-url']).length > 1 ?
                            '<a href="' + data['online-url'] + '" target="_blank">' + createTpl(data, 'page-name') + '</a>'
                            : createTpl(data, 'page-name');
                    })() +
                    '</li>';
            })(),
            (function () {
                var str = '';
                str += '<b ' + isHidden(data, 'design') + '>设计:' + createTpl(data, 'design') + '</b>';
                str += '<b ' + isHidden(data, 'customer') + '>需求:' + createTpl(data, 'customer') + '</b>';
                return str.length > 1 ? '<li>' + str + '</li>' : '';
            })(),
            (function () {
                return '<li ' + isHidden(data, 'tms-url') + '>' + createTpl(data, 'tms-url') + '</li>';
            })(),
            (function () {
                //如果登陆用户，并且是当前条目拥有者，则显示编辑按钮
                return jsonData.userid && jsonData.userid === data['front'] ? '<li class="edit"><b class="J-edit" data-id="' + _id + '">编辑</b></li>' : '';
            })()
        ];
    }
});
