/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:26
 * To change this template use File | Settings | File Templates.
 */

exports.isDisabledRecord = function () {
    var date = new Date();
    var maxDate = require('./date').getMaxDays(date, date.getMonth());
    return date.getDate() === maxDate && date.getHours() >= 18;
};

