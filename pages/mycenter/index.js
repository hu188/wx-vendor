const app = getApp();
import util from '../../utils/util';
import { http } from '../../utils/http';
Page({
  data: {
    userInfo: {},
    isVip:''
  },
  onLoad: function () {
    
    this.setData({
      isVip: app.globalData.isVip
    })
    wx.hideTabBar()
    wx.getUserInfo({
      success: res =>{
        const { userInfo} = res
        this.setData({
          userInfo
        })
      }
    })
  },

  onShow: function () {
    
  }
});
