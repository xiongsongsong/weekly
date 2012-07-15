/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 12-7-15
 * Time: 下午5:22
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
    alias:{
        'jquery':'/global/jquery.js'
    }
});

define(function (require, exports, module) {
    var $ = require('jquery');

    exports.init = function () {
        alert(123);
    }

    exports.init();

});