import { http } from './utils/http'
import { encode } from './utils/encode';
App({
  onLaunch(options) {
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
    sessionId:''
  },
});
