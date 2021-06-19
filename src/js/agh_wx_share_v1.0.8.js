/* 
 * @Author: sharon
 * @Date:   2017-8-23 13:41
 * @before use need axios
 * @Last Modified by:   sharon
 * @Last Modified time: 2017-8-23 13:41
 */

// https://res.wx.qq.com/open/js/jweixin-1.2.0.js
//分享的相关参数配置

// new agho.WxShare({
//   'share_info' : {
//     'title' : '春节带爱回家',
//     'description' : '集齐5位好友，就能飞回家啦！',
//     'url' : encodeURI(url),//url 是要分享的链接
//     'imgUrl' : 'https://s2.aghcdn.com/topic/e17cj/cjhj_share_img.png'
//   },
//   'allowShare':true,//是否启动微信分享jdk
//   'wx_jsApiList' : ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ'],
//   'onShareSuccess': function(){},
//   'onShareCancel': function(){}
// })
function getQueryString(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        r   = window.location.search.substr(1).match(reg);

    if (r !== null) {

        return decodeURI(r[2]);

    }

    return null;
};
var cookieUtils = {

    get  : function (name) {

        var cookieName  = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieEnd   = null,
            cookieValue = null;

        if (cookieStart > -1) {

            cookieEnd = document.cookie.indexOf(';', cookieStart);

            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }

            cookieValue = decodeURIComponent(
                document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
            )

        }


        return decodeURIComponent(cookieValue);
    },
    set  : function (name, value, expires, path, domain, secure) {

        var cookieText = encodeURIComponent(name) + '=' +
            encodeURIComponent(value);

        if (expires instanceof Date) {

            cookieText += '; expires=' + expires.toUTCString();

        }

        if (path) {

            cookieText += '; path=' + path;

        }

        if (domain) {

            cookieText += '; domain=' + domain;

        }

        if (secure) {

            cookieText += '; secure';

        }

        document.cookie = cookieText;


    },
    unset: function (name, path, domain, secure) {
        this.set(name, '', new Date(0), path, domain, secure);
    }

};
// alert('1234')
var agho = agho || {};
agho.WxShare = function(pageData) {
    this.pageData = pageData;
    this.init();
}
agho.WxShare.prototype = {
    isWx: function () {
      return /wxwork/.test(navigator.userAgent.toLowerCase())
    },
    init: function() {
        var self = this;
        if (!!!this.pageData) {
            return true;
        }
        this.getSign(function(data) {
            console.log("databack",data)
            data.jsApiList = self.pageData.wx_jsApiList;
            // if (self.pageData.hasOwnProperty('debug')) {
            //     data.debug = self.pageData.debug;
            // }
            console.log("data",data)
            // data['debug'] = true
            wx.config(data);
            wx.ready(function() {
                // alert('123123')
                if (self.pageData.hasOwnProperty('allowShare') && !self.pageData.allowShare) {
                    wx.hideAllNonBaseMenuItem();
                    return;
                } 
                self.setShareData()
            })
            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                console.log(JSON.stringify(res))
            });
        })
    },

    isAghProcution: function(hst) {
        return location.host.split('.').indexOf(hst) != -1
    },
     jsonp:function(options) {
        options = options || {};
        if (!options.url || !options.callback) {
            throw new Error('请传入合法参数');
        }

        // 创建script标签，并加入到页面中
        // 返回的回调函数名，加入随机参数避免缓存
        var callbackName = ('jsonp_' + Math.random()).replace('.', '');
        // 获取head标签
        var head = document.getElementsByTagName('head')[0];
        // 填充回调函数名
        options.data[options.callback] = callbackName;
        // 格式化参数
        var paramas = this.formatParams(options.data);
        // 创建script标签
        var script = document.createElement('script');
        // 插入script标签的head
        head.appendChild(script);

        // 创建JSONP回调函数
        // window[callbackName]的形式，可是的回调函数可被全局调用
        window[callbackName] = function(json) {
            // script标签的哦src属性只在第一次设置时起作用，即script标签标签是无法重用的，故每次创建回调函数，即每次设置script标签是需要将前一个script以及其src移除
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            options.success && options.success(json);
        };

        // 发送请求

        script.src = options.url + '?' + paramas;
        console.log("script",script)
        // 超时处理
        if (options.timeout) {
            script.timer = setTimeout(function() {
                window[callbackName] = null;
                head.removeChild(script);
                options.fail && options.fail(message, '请求超时');
            }, timeout);
        }
    },
    //格式化参数
    formatParams:function(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        return arr.join('&');
    },
    getSign: function(cb) {
        console.log("是否企业微信",this.isWx())
        if (this.isWx()) {
            var url = 'http://mp.51guanhuai.com/weixin/wxqy_js_share_package.php'
        }else {
            var url = this.isAghProcution('51guanhuai') ?
                'https://mp.51guanhuai.com/weixin/js_share_package.php' :
                'http://mp.test.care001.cn/weixin/js_share_package.php'
        }
        // var url = this.isAghProcution('51guanhuai') ?
        //     'https://mp.51guanhuai.com/weixin/js_share_package.php' :
        //     'http://mp.test.care001.cn/weixin/js_share_package.php'
        //  $.getJSON(url+'callback=?',{'url':location.href.split('#')[0]}).done(function(data){
        //     cb(data.body)
        // }) 
        var date=new Date().getTime();
        var sendData = {
            url:location.href.split('#')[0],
        };
        if (getQueryString('qyCorpId')) {
            sendData.qyCorpId = getQueryString('qyCorpId');
        }else if (cookieUtils.get('qyCorpId')) {
            sendData.qyCorpId = cookieUtils.get('qyCorpId')
        }
        this.jsonp({
            url:url,
            callback:'callback',
            data:{
                'url':sendData.url
            },
            timeoout:5000,
            success:function(data){
                 cb(data.body)
            },
            fail:function(data){
                console.log("fail",data)
            }
        })

    },
    setShareData: function() {
        console.log(this.isWx())
        if (this.isWx()) {
            wx.onMenuShareAppMessage(this.getShareData('friend'));
            wx.onMenuShareWechat(this.getShareData())
        }else {
            wx.onMenuShareAppMessage(this.getShareData("friend"));
            wx.onMenuShareTimeline(this.getShareData("timeline"));
            wx.onMenuShareQQ(this.getShareData());
            wx.onMenuShareWeibo(this.getShareData("weibo"));
        }

    },
    getShareData: function() {
        var baseShareData = {
            title: this.pageData.share_info.title,
            desc: this.pageData.share_info.description,
            link: this.pageData.share_info.url,
            imgUrl: this.pageData.share_info.imgUrl
        };
        if (this.pageData.hasOwnProperty('onShareSuccess') && typeof this.pageData.onShareSuccess == 'function') {
            baseShareData.success = this.pageData.onShareSuccess;
        }
        if (this.pageData.hasOwnProperty('onShareCancel') && typeof this.pageData.onShareCancel == 'function') {
            baseShareData.cancel = this.pageData.onShareCancel;
        }
        return baseShareData;
    }
}