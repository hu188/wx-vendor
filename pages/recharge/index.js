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
    xz: 0,
    czlist: [
    ]
  },
  onLoad: function (e) {
    const {type,level} = app.globalData.type
    const params = {
      sign: encode({
        type: type,
        levelTypeId: level,
        rechargeType: "0",
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        type: type,
        levelTypeId: level,
        rechargeType: "0",
      }
    }
    http('qsq/service/external/recharge/index',params,1, 1).then(res => {
      this.setData({
        czlist: res
      })
    })
  },
  xuanz: function (e) {
    var t = this, a = e.currentTarget.dataset.id;
    t.setData({
      xz: a
    });
  },
  czsave: function (t, a) {
    const { czlist, xz} = this.data
    const item = czlist[xz]
    const {money, giveMoney} = item
    const params = {
      sign: encode({
        userId: app.globalData.userId,
        totalFee: money,
        give: giveMoney,
        appid: app.globalData.id
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        userId: app.globalData.userId,
        totalFee: money,
        give: giveMoney,
        appid: app.globalData.id
      }
    }
    http('qsq/service/external/recharge/recharge', params, 1,1).then(res => {
      const { nonceStr, packageValue, paySign, signType, timeStamp} = res
      wx.requestPayment({
        timeStamp: res.timeStamp + '',
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: 'MD5',
        paySign: res.paySign,
        success: () =>{
          $Toast({
            content: '充值成功',
            type: 'success'
          });
          //wx.navigateBack()
          wx.redirectTo({
            url: '../balance/index'
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