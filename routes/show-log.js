/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:25
 * To change this template use File | Settings | File Templates.
 */

var DB = require('../helper/db');

exports.show_log = function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    var year = parseInt(req.query.year, 10);
    var month = parseInt(req.query.month, 10);
    if (isNaN(year)) {
        year = new Date().getFullYear()
    }
    if (isNaN(month)) {
        month = new Date().getMonth() + 1;
    }

    require('../helper/user').updateFrontList({
        callback:function () {
            var result = Object.create(null);
            var collection = new DB.mongodb.Collection(DB.client, 'log');
            collection.find({year:year, month:month, level:{'$gt':0}}, {}).toArray(function (err, docs) {
                result.documents = docs;
                result.user = require('../helper/user').frontList;
                result.serverDate = Date.now();
                res.end(JSON.stringify(result, undefined, '\t'));
            });
        }
    })

};
