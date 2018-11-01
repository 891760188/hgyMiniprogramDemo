const config = require('../../config')
var appInstance = getApp(); 
Page({
  onShareAppMessage() {
    return {
      title: '小程序官方组件展示',
      path: 'page/component/index'
    }
  },

  data: {
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['view', 'scroll-view', 'swiper', 'movable-view', 'cover-view']
      }, {
        id: 'content',
        name: '基础内容',
        open: false,
        pages: ['text', 'icon', 'progress', 'rich-text']
      }, {
        id: 'form',
        name: '表单组件',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea']
      }, {
        id: 'nav',
        name: '导航',
        open: false,
        pages: ['navigator']
      }, {
        id: 'media',
        name: '媒体组件',
        open: false,
        pages: ['image', 'audio', 'video', 'camera']
      }, {
        id: 'map',
        name: '地图',
        open: false,
        pages: ['map']
      }, {
        id: 'canvas',
        name: '画布',
        open: false,
        pages: ['canvas']
      }, {
        id: 'open',
        name: '开放能力',
        open: false,
        pages: ['ad', 'open-data', 'web-view']
      }
    ]
  },

  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },
  reuestDemo(){
    wx.request({
      url: config.localServer +'api/wc/test0001.file',
      data: {
        code: 1
      },
      success(res) {
        console.log('拉取openid成功', res)

      },
      fail(res) {
        console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
      }
    })
  },
  /**
   * 获取openid和session_token
   */
  code2openid(){
    wx.login({
      success(data) {
        debugger
        wx.request({
          url: config.localServer +'api/wc/jscode2session.file',
          data: {
            code: data.code
          },
          success(res) {
            debugger
            console.log('拉取openid成功', res)

          },
          fail(res) {
            debugger
          }
        })
      },
      fail(err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        callback(err)
      }
    })
  },
  /**
   * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
   */
  openSetting(){
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
              "scope.camera":true
        }
      }
    })
  },
  /**
   * 向用户发起授权请求
   * https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
   */
  authorizeRequest(){
    // wx.authorize({
    //   scope: 'scope.camera',
    //   success() {
    //     // 用户已经授权，后续不会弹窗询问
    //    debugger
    //   },
    //   fail:function(){
    //     debugger
    //   }
    // })
  }
  ,
  /**
   * 打开授权设置
   */
  authSetting(){
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },
  /**
   *  支付例子
   * const config = require('../../config')获取全局配置
   * const appInstance = getApp();获取全局上下文实例
   */
  payMethod(){
    let _this = this ;//当前上下文
    //获取登录code  
    wx.login({
      success: result =>{
        console.info(result.code)
        //获取openid 
        _this.getOpenId(result.code) 
      }
    }); 
  },
  /**
   * 用code作为参数请求Java服务，像微信服务换取openId，access_token
   * 此处用到openId，access_token暂时无用，为安全起见，此字段不返回客户端
   */
  getOpenId(code){
    let _this = this;//当前上下文
    wx.request({
      url: config.localServer + 'api/wc/jscode2session.wc',
      data: { code: code},
      method: 'POST',
      success: result =>{
        console.info('返回openId')
        console.info(result.data)
        _this.generateOrder(result.data.data.openid)
      },
      fail:() => {
        console.info('fail')
      },
      complete: () => {
        // complete 
      }
    }) 
  },
  /**
   * 用openid，在Java服务请求微信服务，获取支付的请求参数
   */
  generateOrder(openid){
    var _this = this 

    var paymentPo={
      openid: openid,
      total_fee: '0.1',
      mch_id: 'mch_id',
      body: '支付测试',
      detail: 'detail',
      attach: '假酒'
    }

    wx.request({
      url: config.localServer + 'api/wc/payOrderPublic.wc',
      method: 'POST',
      data: paymentPo,
      success: result => {
        console.info(result)
        var pay = result.data.data
        //发起支付 
        var timeStamp = pay[0].timeStamp;
        console.info("timeStamp:" + timeStamp)
        var packages = pay[0].package;
        console.info("package:" + packages)
        var paySign = pay[0].paySign;
        console.info("paySign:" + paySign)
        var nonceStr = pay[0].nonceStr;
        console.info("nonceStr:" + nonceStr)
        var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        _this.pay(param)
      },
    }) 
  },
  /**
   * 支付的动作
   */
  pay(param){
    console.info("支付")
    console.info(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: (result) => {
        console.info("支付")
        console.info(result)
     
      },
      fail: (result) => {
        console.info("支付失败")
        console.info(result)
      },
      complete: () => {
        console.info("pay complete")
      }
    }) 
  }

})
