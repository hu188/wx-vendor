let app = getApp();
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
Page({
  data: {
   balance: 0,
    hasUserInfo:''
  },
  onLoad: function (e) {
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo
    })
    if (app.globalData.hasUserInfo){
      const params = {
        sign: encode({
          userId: app.globalData.userId
        }, app.globalData.sessionId),
        sessionId: app.globalData.sessionId,
        params: {
          userId: app.globalData.userId
        }
      }
      http('qsq/service/external/recharge/queryBalance', params, 1, 1).then(res => {
        const { chargeMoney } = res
        this.setData({
          balance: chargeMoney / 100
        })
        app.globalData.balance = chargeMoney / 100
      })
    }else{
      wx.showToast({
        title: '请先登录哦',
        icon: 'none'
      })
    }

  },
  onShow(){
    app.globalData.balance=this.data.balance
  }

});