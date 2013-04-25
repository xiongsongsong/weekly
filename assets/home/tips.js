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
    link.push('<li><a target="_blank" href="https://github.com/lifesinger/lifesinger.github.com/issues/105">最难的HTML+CSS</a></li>');
    link.push('<li><a target="_blank" href="http://msdn.microsoft.com/zh-cn/magazine/cc163419.aspx">JavaScript 基础</a></li>');
    link.push('<li><a target="_blank" href="https://github.com/TooooBug/javascript.patterns/blob/master/chapter4.markdown#-1">函数</a></li>');
    link.push('<li><a target="_blank" href="http://www.atatech.org/article/detail/7259/392">对象</a></li>')
    link.push('<li><a target="_blank" href="http://www.cnblogs.com/pifoo/archive/2011/05/23/webkit-touch-event-1.html">指尖上的JS</a></li>');
    link.push('<li><a target="_blank" href="http://justjavac.com/">justjavac(迷渡) </a></li>');
    link.push('<li><a target="_blank" href="https://github.com/lifesinger/lifesinger.github.com/issues?state=open">玉伯的博客 </a></li>');

    var ul = S.query('#sidebar-group ul');
    ul = S.one(ul[ul.length - 1]);
    ul.append(link.join(''));


});
