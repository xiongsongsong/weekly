/**
 * Created with IntelliJ _idEA.
 * User: xiongsongsong
 * Date: 13-2-24
 * Time: 下午1:45
 * To change this template use File | Settings | File Templates.
 */

var DB = require('./db');

var obj = [
    {
        "name": "伯阳89",
        "real-name": "华旭剑"
    },
    {
        "name": "元茗01",
        "real-name": "孙婷"
    },
    {
        "name": "仲直01",
        "real-name": "杨斌斌"
    },
    {
        "name": "伯宁07",
        "real-name": "李成宁"
    },
    {
        "name": "元瑾04",
        "real-name": "王佳利"
    },
    {
        "name": "元常15",
        "real-name": "魏小华"
    },
    {
        "name": "伯瑜09",
        "real-name": "王慕明"
    },
    {
        "name": "伯仁08",
        "real-name": "沈明祥"
    },
    {
        "name": "元节28",
        "real-name": "李铃慧"
    },
    {
        "name": "元让03",
        "real-name": "张梅君"
    },
    {
        "name": "伯和01",
        "real-name": "苏秀康"
    },
    {
        "name": "元泰89",
        "real-name": "求晓芳"
    },
    {
        "name": "仲权03",
        "real-name": "章权"
    },
    {
        "name": "xiong_song",
        "real-name": "熊松松"
    }
];

/*var collection = new DB.mongodb.Collection(DB.client, 'user');
 collection.insert(obj, {safe: true}, function () {
 console.log(true)
 });*/


var collection = new DB.mongodb.Collection(DB.client, 'log');


collection.update({ front: 61}, {$set: {front: "5129eb89ced235d103000001"}});
collection.update({ front: 62}, {$set: {front: "5129eb89ced235d103000002"}}, {multi: true});
collection.update({ front: 51}, {$set: {front: "5129eb89ced235d103000003"}}, {multi: true});
collection.update({ front: 52}, {$set: {front: "5129eb89ced235d103000004"}}, {multi: true});
collection.update({ front: 49}, {$set: {front: "5129eb89ced235d103000005"}}, {multi: true});
collection.update({ front: 57}, {$set: {front: "5129eb89ced235d103000006"}}, {multi: true});
collection.update({ front: 54}, {$set: {front: "5129eb89ced235d103000007"}}, {multi: true});
collection.update({ front: 60}, {$set: {front: "5129eb89ced235d103000008"}}, {multi: true});
collection.update({ front: 59}, {$set: {front: "5129eb89ced235d103000009"}}, {multi: true});
collection.update({ front: 56}, {$set: {front: "5129eb89ced235d10300000a"}}, {multi: true});
collection.update({ front: 47}, {$set: {front: "5129eb89ced235d10300000b"}}, {multi: true});
collection.update({ front: 53}, {$set: {front: "5129eb89ced235d10300000c"}}, {multi: true});
collection.update({ front: 63}, {$set: {front: "5129eb89ced235d10300000d"}}, {multi: true});
collection.update({ front: 168}, {$set: {front: "5129eb89ced235d10300000e"}}, {multi: true});