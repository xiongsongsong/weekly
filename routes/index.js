/*
 * GET home page.
 */

var $ = require("mongous").Mongous;


/*$("database.collection").find({},function(r){
 console.log(r);
 });*/

exports.index = function (req, res) {
    res.render('index', { title:'Express', date:new Date() })
};

exports.save_log = function (req, res) {
    var data = Object.create(null);
    data._id = parseInt(Date.now() + parseInt(Math.random() * 100000), 10);
    data['page-name'] = req.body['page-name'].trim();
    data['front'] = parseInt(req.body['front'], 10);
    data['level'] = parseInt(req.body['level'], 10);
    data['design'] = req.body['design'].trim();
    data['customer'] = req.body['customer'].trim();
    data['online-url'] = req.body['online-url'].trim();
    data['tms-url'] = req.body['tms-url'].trim();
    data['note'] = req.body['note'].trim();
    data['year'] = parseInt(req.body['year'], 10);
    data['month'] = parseInt(req.body['month'], 10);
    data['date'] = parseInt(req.body['date'], 10);
    $("fed.log").save(data);
    $("fed.log").find({_id:data._id}, function (result) {
        res.end(JSON.stringify(result, undefined, '\t'));
    });
};

exports.record_log = function (req, res) {

};