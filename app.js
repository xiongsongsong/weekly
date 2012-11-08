/*
 * 记录业务日志
 * */

'use strict';

var express = require('express');
var app = expres/Users/xiongsongsong/Downloads/webkitdirectory-folder-upload/index.phps();
var io = require('socket.io');

var server = require('http').createServer(app);

io = io.listen(server);

server.listen(3001);

var index = 0;
var chat = io.of('/chat').on('connection', function (socket) {
    chat.emit('coming', { serverTime:index++});
    //只针对当前用户
    socket.on('set nickname', function (name) {
        socket.set('nickname', name, function () {
            socket.emit('ready');
        });
    });

    socket.on('msg', function (data) {
        socket.get('nickname', function (err, name) {
            console.log('Chat message by ', name);
        });
        console.log('Client MSG:' + data);
    });

    socket.on('pageX', function (data) {
        chat.emit('all-page-x', { pageX:data});
    });

    setInterval(function () {
        socket.get('nickname', function (err, name) {
            socket.emit('a message', { youare:name + Date.now() });
        });
        chat.emit('a message', { everyone:'in', '/chat':'公共消息' + Date.now() });
    }, 5000);

});


// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret:"keyboard cat" }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/assets'));
    app.use(express.static(__dirname + '/demo'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

require('./routes').init(app);

app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode");
});
