/**
 * Created with IntelliJ _idEA.
 * User: xiongsongsong
 * Date: 13-2-24
 * Time: 下午1:45
 * To change this template use File | Settings | File Templates.
 */

var DB = require('./db');

var user = [
    {
        "front": 53,
        "name": "元泰89",
        "real-name": "求晓芳",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 56,
        "name": "元让03",
        "real-name": "张梅君",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 59,
        "name": "元节28",
        "real-name": "李铃慧",
        pwd: 'd0fee31f0bf0f3a2fd15206da69695f19918ac5ff11ec8d11d4236cf376206b15d7ef8e5aacaf09be9b97ae8e4d4a837e2a8b544d49daea7a832b7f9143279d8'
    },
    {
        "front": 47,
        "name": "伯和01",
        "real-name": "苏秀康",
        pwd: 'd0fee31f0bf0f3a2fd15206da69695f19918ac5ff11ec8d11d4236cf376206b15d7ef8e5aacaf09be9b97ae8e4d4a837e2a8b544d49daea7a832b7f9143279d8'
    },
    {
        "front": 51,
        "name": "仲直01",
        "real-name": "杨斌斌",
        pwd: 'd0fee31f0bf0f3a2fd15206da69695f19918ac5ff11ec8d11d4236cf376206b15d7ef8e5aacaf09be9b97ae8e4d4a837e2a8b544d49daea7a832b7f9143279d8'
    },
    {
        "front": 62,
        "name": "元茗01",
        "real-name": "孙婷",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 60,
        "name": "伯仁08",
        "real-name": "沈明祥",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 63,
        "name": "仲权03",
        "real-name": "章权",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 52,
        "name": "伯宁07",
        "real-name": "李成宁",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 57,
        "name": "元常15",
        "real-name": "魏小华",
        pwd: 'd0fee31f0bf0f3a2fd15206da69695f19918ac5ff11ec8d11d4236cf376206b15d7ef8e5aacaf09be9b97ae8e4d4a837e2a8b544d49daea7a832b7f9143279d8'
    },
    {
        "front": 49,
        "name": "元瑾04",
        "real-name": "王佳利",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 61,
        "name": "伯阳89",
        "real-name": "华旭剑",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    },
    {
        "front": 54,
        "name": "伯瑜09",
        "real-name": "王慕明",
        pwd: 'd0fee31f0bf0f3a2fd15206da69695f19918ac5ff11ec8d11d4236cf376206b15d7ef8e5aacaf09be9b97ae8e4d4a837e2a8b544d49daea7a832b7f9143279d8'
    },
    {
        "front": 168,
        "name": "xiong_song",
        "real-name": "熊松松",
        pwd: '503124000a803f1993685ea282b4b92d66e6d1f85cb837a4ed4522a561b5e352e6aa87eaf6e66cdc57ce76931a03531de6bf796d9e87b9763f96f8da04146c9e'
    }
];


var _tempUser = [];

user.forEach(function (item) {
    var id = DB.mongodb.ObjectID();
    _tempUser.push({
        _id: id,
        name: item.name,
        'real-name': item['real-name'],
        pwd: item.pwd

    })
    item.frontID = id;
});

var collection = new DB.mongodb.Collection(DB.client, 'user');
collection.insert(_tempUser, {safe: true}, function () {
    var collection = new DB.mongodb.Collection(DB.client, 'log');
    user.forEach(function (item) {
        collection.update({ front: item.front}, {$set: {front: item.frontID}}, {multi: true});
    })
});
