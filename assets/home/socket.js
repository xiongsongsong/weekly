/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-11-3
 * Time: 下午2:23
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
    alias:{
        'io':'/socket.io'
    }
});

define(['io'], function (require, exports, module) {
    var io = require('io');
    var chat = io.connect('http://localhost:3001/chat');
    chat.on('connect', function () {
        chat.emit('set nickname', prompt('What is your nickname?'));
    });

    var S = KISSY, Event = S.Event;
    Event.on(document.body, 'mousemove', function (ev) {
        chat.emit('pageX', ev.clientX);
    });

    chat.on('a message', function (data) {
        console.log(JSON.stringify(data));
    });

    chat.on('all-page-x', function (data) {
        S.one('#header h1').html(data.pageX);
    });


});
