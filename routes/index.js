/*
 * GET home page.
 */

var $ = require("mongous").Mongous;


/*$("database.collection").find({},function(r){
 console.log(r);
 });*/

exports.isLogin = function (req) {
    var remember;
    if (req.cookies) {
        remember = req.cookies['remember'];
        return remember !== undefined && remember !== '' && req.session.userid !== undefined && req.session.userid !== '';
    } else {
        return false;
    }
};

/*将用户列表缓存起来*/

var user = Object.create(null);
exports.getUser = function () {
    user.result = [];
    $("fed.user").find({}, function (result) {
        result.documents.forEach(function (item, index) {
            user['id_' + item._id] = item.name;
            user.result.push({
                id:item._id,
                name:item.name
            })
        });
    });
};

exports.getUser();

exports.index = function (req, res) {
    res.render('index', {
        title:'前端业务日志',
        isLogin:exports.isLogin(req),
        date:new Date(),
        username:req.session.username,
        user:user
    });
};

exports.save_log = function (req, res) {
    var data = Object.create(null), body = req.body;
    data['page-name'] = body['page-name'];
    data['level'] = parseInt(body['level'], 10);
    data['design'] = body['design'];
    data['customer'] = body['customer'];
    data['online-url'] = body['online-url'];
    data['tms-url'] = body['tms-url'];
    data['note'] = body['note'];
    data['year'] = parseInt(body['year'], 10);
    data['month'] = parseInt(body['month'], 10);
    data['date'] = parseInt(body['date'], 10);
    data['front'] = req.session.userid;

    var errorMSG = Object.create(null);
    errorMSG.errorList = [];

    if (!exports.isLogin(req)) {
        errorMSG.errorList.push({name:'login', msg:'登陆过期，请刷新页面重新登陆'});
    }

    if (data['page-name'] == undefined || data['page-name'].length < 1) {
        errorMSG.errorList.push({name:'page-name', msg:'页面名称不能为空'});
    }

    if (isNaN(data['level'])) {
        errorMSG.errorList.push({name:'level', msg:'需要页面对应的等级'});
    }

    if (isNaN(data['year']) || isNaN(data['month']) || isNaN(data['date'])) {
        errorMSG.errorList.push({name:'year', msg:'完成时间无效'});
    } else {

        if (data['year'] < 2000 || data['year'] > 2100) {
            errorMSG.errorList.push({name:'year', msg:'年份越界'});
        }

        if (data['month'] < 1 || data['month'] > 12) {
            errorMSG.errorList.push({name:'date', msg:'月份越界'});
        }

        if (data['month'] == 2) {
            if (data['year'] % 4 == 0) {
                if (data['date'] > 29 || data['date'] < 1) {
                    errorMSG.errorList.push({name:'date', msg:'闰年2月日期无效'});
                }
            } else {
                if (data['date'] > 28 || data['date'] < 1) {
                    errorMSG.errorList.push({name:'date', msg:'2月日期无效'});
                }
            }
        } else {
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(data['month']) >= 0) {
                if (data['date'] < 1 || data['date'] > 31) {
                    errorMSG.errorList.push({name:'date', msg:'日期无效'});
                }
            } else if ([4, 6, 9, 11].indexOf(data['month']) >= 0) {
                if (data['date'] < 1 || data['date'] > 30) {
                    errorMSG.errorList.push({name:'date', msg:'日期无效'});
                }
            }
        }
    }

    if (errorMSG.errorList.length > 0) {
        res.end(JSON.stringify(errorMSG), undefined, '\t');
    } else {
        $("fed.log").save(data);
        res.end(JSON.stringify({'status':true}, undefined, '\t'));
    }
};

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
    $("fed.log").find({year:year, month:month}, function (result) {
        result.user = user;
        res.end(JSON.stringify(result, undefined, '\t'));
    });
};

exports.login = function (req, res) {

    var md5 = require('md5');
    var user = req.body.user;
    var pwd = req.body.pwd;
    var msg = Object.create(null);
    msg.list = [];

    if (user == undefined) {
        msg.list.push("用户名不能为空");
        res.end(JSON.stringify(msg, undefined, '\t'));
        return;
    }

    user = user.trim();

    if (pwd == undefined) {
        msg.list.push("密码不能为空");
        res.end(JSON.stringify(msg, undefined, '\t'));
        return;
    }
    pwd = pwd.trim();

    $("fed.user").find({name:user}, 1, function (result) {
        if (result.documents.length === 0) {
            msg.list.push('无法找到该用户');
        } else {
            msg.status = md5.digest_s(pwd) === result.documents[0].pwd;
            if (msg.status) {
                res.cookie('remember', 'yes', { httpOnly:true});
                req.session.username = user;
                req.session.userid = result.documents[0]._id;
            }
        }
        msg.user = user;
        res.end(JSON.stringify(msg, undefined, '\t'));
    });
};

exports.log_out = function (req, res) {
    res.clearCookie('remember');
    res.redirect('/');
};

exports.helperAddUser = function () {
    var userList = [ 'user_a' ];
    var user = [];
    var md5 = require('md5');
    userList.forEach(function (item, index) {
        $("fed.user").save({
            _id:index + 1,
            name:item,
            pwd:md5.digest_s(item)
        });
    });

};

/*
 exports.helperAddUser();*/
