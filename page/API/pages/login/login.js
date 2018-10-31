const app = getApp()
Page({
  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '微信登录',
      path: 'page/API/pages/login/login'
    }
  },
  /**
   * 页面加载后判断是否已经登录
   */
  onLoad() {
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
  },
  data: {},
  /**
   * 登录
   */
  login() {
    const that = this
    wx.login({
      success() {
        app.globalData.hasLogin = true
        that.setData({
          hasLogin: true
        })
      }
    })
  }
})
