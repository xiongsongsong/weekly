/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-31
 * Time: 下午6:51
 * To change this template use File | Settings | File Templates.
 */

exports.getMaxDays = function (date, month) {
    if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
        return 31;
    } else {
        return month == 1 ? date.getFullYear() % 4 == 0 ? 29 : 28 : 30;
    }
};