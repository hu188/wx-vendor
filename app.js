import { http } from './utils/http'
import { encode } from './utils/encode';
App({
  onLaunch(options) {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '更新提示',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    this.reLogin()
  },
  reLogin() {
    var that = this
    setTimeout(function () {
      wx.login({
        scopes: 'auth_user',
        success: (res) => {
          wx.getUserInfo({
            success: result => {
              const data = {
                "code": res.code,
                "keyPoolId": that.globalData.id, //小程序id
              }
              let { encryptedData, iv } = result

              http('qsq/miniService/miniProComm/weChatCommon/commonLogin', JSON.stringify(data), 1, 1).then(lres => {

                that.globalData.sessionId = lres.sessionId;
                const params = {
                  sign: encode({
                    openid: lres.openid,
                    encryptedData: encryptedData,
                    iv: iv
                  }, lres.sessionId),
                  sessionId: lres.sessionId,
                  params: {
                    openid: lres.openid,
                    encryptedData: encryptedData,
                    iv: iv
                  }
                }
                http('qsq/miniService/miniProComm/weChatCommon/saveAnalysisData', JSON.stringify(params), 1, 1).then(sres => {

                })

              })
            }
          })
        }
      })
      that.reLogin()
    }, 3600000) //延迟时间 一小时3600000
  },
  globalData: {
    userInfo: null,
    user_id: '',//支付宝userid
    projecttitle: '天任售货机平台',
    appid: 'wx978041ffe305d125',
    hostname: 'https://www.tianrenyun.com',
    imgPath: 'https://www.tianrenyun.com/qsqFile/filelib/imagelib/dealerlib/',
    goodsList: [], //结算时选中的商品,
    type: {},
    sessionkey: '',
    auth: false,
    balance: 0,
    deviceId:'',
    classify:'',//设备类型
    userId:'',//用户id
    isVip: '',//1为vip用户
    isFirstBuy:0,//是否第一次购买
    id: '',//小程序id
    sign:'',
    deviceName:'',
    urlType:'',
    url:'',
    tp: '',//0单货单，1多货道
    nickname:'',
    sessionId:'',
    oneLoad: true,
    hasUserInfo: false,//是否授权
  },

  /**
  * 加载登录工具包
  */
  loadUtil: function () {
    return require('utils/login.js');
  }
});
