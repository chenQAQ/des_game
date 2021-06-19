import { changeShare } from "../../vuex/actions"

function isEnvir(hst) {
    return location.host.split('.').indexOf(hst) != -1
}

var aghWX = {

    getSign: function(cb) {
        var url = isEnvir('51guanhuai') ?
            'http://topic.51guanhuai.com/weixin/js_share_package.php?' :
            'http://mp.test.care001.cn/weixin/js_share_package.php?'
        $.getJSON(url + 'callback=?', { 'url': location.href.split('#')[0] }).done(function(data) {
            cb(data.body)
        })
    },
    init: function(cb) {
        if (window.pageData == undefined || !pageData.use_wx) return false
        this.getSign(function(data) {
            var cfg = $.extend({ debug: false, jsApiList: pageData.wx_jsApiList }, data)
                // console.log(cfg)
            wx.config(cfg);
            wx.ready(function() {
                aghWX.setShareData()
                if (typeof cb == 'function') {
                    cb()
                }
            })
        })
    },
    setShareData: function() {
        wx.onMenuShareAppMessage(this.getShareData("friend"));
        wx.onMenuShareTimeline(this.getShareData("timeline"));
        wx.onMenuShareQQ(this.getShareData());
        wx.onMenuShareWeibo(this.getShareData("weibo"));
    },
    getShareData: function() {
        var baseShareData = {
            title: pageData.wx_share.shareTitle,
            desc: pageData.wx_share.descContent,
            link: pageData.wx_share.shareLink,
            imgUrl: pageData.wx_share.imgUrl
        };
        if (typeof(on_wx_share_success) == 'function') {
            console.log("shareSuccess")
            baseShareData.success = on_wx_share_success;
        }
        return baseShareData;
    }
}


function on_wx_share_success() {
    var shareType = {
        showShareTip: false,
        showShareSuccess: true
    }
    changeShare(shareType);
}

aghWX.init()