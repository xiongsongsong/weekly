/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-11
 * Time: 下午12:05
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var S = KISSY, span = S.DOM.get('span', '#header');
    S.Anim(S.DOM.get('span', '#header'), {top: '0px'}, 1.2, 'elasticBoth').run();



        var link = [];
        link.push('<li style="border-top:dotted 1px #ccc;"><a target="_blank" href="http://www.atatech.org/article/detail/7259/392">JavaScript中的对象</a></li>')
        link.push('<li><a target="_blank" href="http://msdn.microsoft.com/zh-cn/magazine/cc163419.aspx">JavaScript 基础</a></li>')

        var ul = S.query('#sidebar-group ul');
        ul = S.one(ul[ul.length - 1]);
        ul.append(link.join(''));


});
