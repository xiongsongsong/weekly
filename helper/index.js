/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-8-22
 * Time: 上午9:26
 * To change this template use File | Settings | File Templates.
 */

/*每个月最后一天，下午16点后，属于统计时段，将无法增添新日志记录*/
exports.isDisabledRecord = function () {
    var date = new Date();
    var maxDate = require('./date').getMaxDays(date, date.getMonth());
    return date.getDate() === maxDate && date.getHours() >= 16;
};

