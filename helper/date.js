/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-31
 * Time: 下午6:51
 * 一三五七八十腊，三十一天永不差
 */

//注意，month范围为 0 - 11

exports.getMaxDays = function (date, month) {
    month++;
    return [1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1 ? 31 : month == 2 ? date.getFullYear() % 4 == 0 ? 29 : 28 : 30;
};
