/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-11
 * Time: 下午12:05
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var span = KISSY.DOM.get('span', '#header');
    if (span)  KISSY.Anim(KISSY.DOM.get('span', '#header'), {top: '0px'}, 1.2, 'elasticBoth').run();
});