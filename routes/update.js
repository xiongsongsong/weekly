/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-3-24
 * Time: 下午5:36
 * To change this template use File | Settings | File Templates.
 */
var DB = require('../helper/db');


function update() {
    var logCollection = new DB.mongodb.Collection(DB.client, 'log');

    logCollection.find().toArray(function (err, result) {

        function _update() {
            if (result.length < 1) {
                console.log('请运行db.log.update({},{$unset:{year:1,month:1,date:1}},false,true)');
                return;
            }
            var obj = result.shift();
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setYear(obj.year);
            date.setMonth(obj.month - 1);
            date.setDate(obj.date);
            logCollection.findAndModify({_id: obj._id}, [
            ],
                {$set: {completion_date: date.getTime()}}, {}, function (err, doc) {
                    _update()
                });

        };

        _update();
    });

}

//update();