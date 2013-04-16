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


    S.jsonp('https://api.github.com/repos/lifesinger/lifesinger.github.com/issues?state=opend', function (data) {

        var link = [];
        for (var j = 0; j < data.data.length; j++) {
            link.push('<li><a target="_blank" href="' + data.data[j].html_url + '">' + data.data[j].title + '</a></li>')
            if (j > 5) break;
        }

        link.push('<li style="border-top:solid 1px #ccc;"><a target="_blank" href="http://www.atatech.org/article/detail/7259/392">JavaScript中的对象</a></li>')
        link.push('<li><a target="_blank" href="http://msdn.microsoft.com/zh-cn/magazine/cc163419.aspx">JavaScript 基础</a></li>')


        var ul = S.query('#sidebar-group ul');
        ul = S.one(ul[ul.length - 1]);
        ul.html(link.join(''));

    });

});
