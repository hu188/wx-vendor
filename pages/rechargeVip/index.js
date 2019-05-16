let app = getApp();
import { http } from '../../utils/http';
import {
  encode
} from '../../utils/encode';
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    money:0,
    giveMoney:0,
    czlist: [
    ],
    isVip:'',
    endTime:''
  },
  onLoad: function (e) {
    const params = {
      sign: encode({
        userId: app.globalData.userId
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        userId: app.globalData.userId
      }
    }
       http('qsq/service/external/recharge/queryBalance', params,1,1).then(res => {
       this.setData({
         isVip: res.isvip,
       })
       if (res.strEndTime){
         this.setData({
           endTime: res.strEndTime,
         })
       }
    })
    const { type, level } = app.globalData.type
    const vipParams = {
      sign: encode({
        type: type,
        level: level
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        type: type,
        level: level
      }
    }
    http('qsq/service/external/vip/queryVipParam', vipParams,1, 1).then(res => {
      if (res != ''){
        this.setData({
          money: res[0].money ?res[0].money :0,
          giveMoney: res[0].giveMoney ? res[0].giveMoney : 0
        })
      }
    })
  },
  
  czsave: function (t, a) {
    const param = {
      userId: app.globalData.userId,
      money: this.data.money,
      give: this.data.giveMoney,
      appid: app.globalData.id
    }
    const params = {
      sign: encode({
        userId: app.globalData.userId,
        money: this.data.money,
        give: this.data.giveMoney,
        appid: app.globalData.id
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        userId: app.globalData.userId,
        money: this.data.money,
        give: this.data.giveMoney,
        appid: app.globalData.id
      }
    }
    http('qsq/service/external/recharge/rechargeVip', params,1, 1).then(res => {
      wx.requestPayment({
        timeStamp: res.timeStamp + '',
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: 'MD5',
        paySign: res.paySign,
        success: () =>{
          const params = {
            sign: encode({
              userId: app.globalData.userId
            }, app.globalData.sessionId),
            sessionId: app.globalData.sessionId,
            params: {
              userId: app.globalData.userId
            }
          }
            http('qsq/service/external/recharge/queryBalance', params,1, 1).then(res => {
            app.globalData.balance = res.chargeMoney/100
            })
          app.globalData.isVip = 1
          app.globalData.isFirstBuy = 1
          $Toast({
            content: '充值成功',
            type: 'success'
          });
          wx.switchTab({
            url: '../mycenter/index',
          })
        },
        fail:() =>{
          $Toast({
            content: '充值失败',
            type: 'error'
          });
        }
      })
    })
  }
});