/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-21
 * Time: 下午5:28
 * To change this template use File | Settings | File Templates.
 */

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var fed = new mongodb.Db('fed', server, {});

exports.mongodb = mongodb;

exports.dbServer = fed;
exports.client = undefined;

exports.open = function (callback) {
    fed.open(function (error, client) {
        exports.client = !error ? client : undefined;
        !error ? callback.success() : callback.error();
    });
};

fed.on('close', function () {
    console.log('Database connection is disconnected!\t' + new Date().toLocaleTimeString());
});
