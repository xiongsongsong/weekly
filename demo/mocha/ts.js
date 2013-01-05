/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-26
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */


function forward(str) {

    str = str.toString();
    var point = ''; //存放可能存在的小数点
    var pointIndex = str.indexOf('.');

    //将小数点存放到point中
    if (pointIndex > -1) {
        point = parseInt(str.substring(str.indexOf('.') + 1), 10);
        if (isNaN(point)) point = '';
    }

    //对整数部分进行千分位
    if (pointIndex > -1) {
        str = str.substring(0, pointIndex);
    }

    //每隔三位数增添千分位标记
    var c = str.toString().split('').reverse().join('').replace(/([\d]{3})/g, '$1,').split('').reverse().join('');
    if (c.indexOf(',') == 0) c = c.substring(1);
    if (pointIndex > -1) c += '.' + point;
    return c;
}


function back(str) {
    return str.replace(/,/g, '');
}