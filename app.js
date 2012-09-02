/*
 * 记录业务日志
 * */

var express = require('express');
var app = module.exports = express.createServer();

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

app.listen(8000, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
