const config = require('../../config')
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
  }
})
