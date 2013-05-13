/*
 * 记录业务日志
 * */

'use strict';

var express = require('express');
var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/assets'));
    app.use(express.static(__dirname + '/demo'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

require('./routes').init(app);

//监控使用，返回服务器日志
app.get('/server-log', function (req, res) {
    res.header('content-type', 'text/plain;charset=gbk');
    res.sendfile('./log.txt', function (err, data) {
        res.end(data);
    });
});



app.listen(8000, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
