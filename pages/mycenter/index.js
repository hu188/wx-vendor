const app = getApp();
import util from '../../utils/util';
import { http } from '../../utils/http';
Page({
  data: {
    isVip:'',
    nickName: '点击登录',
    isLoad: false,
    avatarUrl: '../images/user.jpg'
  },
  onLoad: function () {
   
  },
  toUserInfo: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo'
    })
  },
  onShow: function () {
    let that = this;
    that.setData({
      isVip: app.globalData.isVip
    })
    wx.hideTabBar()
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  }
});
