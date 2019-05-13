let app = getApp();
import { http } from '../../utils/http'
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
    http('qsq/service/external/recharge/index', app.globalData.type, 1).then(res => {
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
    const param = {
      userId: app.globalData.userId,
      totalFee: money,
      give: giveMoney,
      appid:app.globalData.id
    }
    http('qsq/service/external/recharge/recharge', param, 1).then(res => {
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