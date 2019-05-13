// pages/index/scancode.js
//获取应用实例
import { http } from '../../utils/http.js'
const app = getApp();
Page({
  data: {
    couponList: []
  },
  onLoad: function () {
   
    // http('qsq/service/external/coupon/all', { sessionKey: sessionKey }, 1).then(res => {
    //   this.setData({
    //     couponList: res
    //   })
    // })
  },
  onShow(e) {

  },

  //显示详细信息
  getcouponinfo: function (e) {
    // console.log(e.currentTarget.dataset)
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation;
    animation.top('0px').step();
    this.setData({
      animationData: animation.export(),
      couponname: e.currentTarget.dataset.couponname,
      endtime: e.currentTarget.dataset.endtime,
      price: e.currentTarget.dataset.price,
      starttime: e.currentTarget.dataset.starttime,
      useofrange: e.currentTarget.dataset.useofrange,
      detailedurl: e.currentTarget.dataset.detailedurl,
    })

  },
  //关闭详细信息
  closecouponinfo: function (e) {
    console.log(54545);
    var animation = my.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation;
    animation.top('1000px').step();
    this.setData({
      animationData: animation.export()
    })
  }
})