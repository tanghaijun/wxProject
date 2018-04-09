var app = getApp();
function loginCheck(pageObj) {
  if (pageObj.onReady) {
    let _onReady = pageObj.onReady;
    // 使用onLoad的话需要传递options
    pageObj.onReady = function (options) {
      app.userInfoReadyCallback = res => {
        var isbind = false;
        var g = app.globalData;
        wx.request({
          url: g.domain + '/getuser',
          data: { openid: g.userInfo.openid },
          success: function (res) {
            if (res.data != '') {
              isbind = true;
              g.userInfo.groupid = res.data.groupid;
              var score = res.data.score;
              var rule = g.scoreRule.find(e => e.start <= score && e.end > score);
              g.userInfo.ph = rule.name;
              g.userInfo.score = score;
              g.userInfo.mobile = res.data.mobile;
            }
            g.userInfo.isbind = isbind;
            if (isbind) {
              // 获取当前页面
              let currentInstance = getPageInstance();
              _onReady.call(currentInstance, options);
            } else {
              //跳转到登录页
              wx.redirectTo({
                url: "/pages/bind/bind"
              });
            }
          }
        })
      }
     
    }
  }
  return pageObj;
}

// 获取当前页面
function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

exports.loginCheck = loginCheck;