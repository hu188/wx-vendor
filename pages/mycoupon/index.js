//获取应用实例
import {http} from '../../utils/http.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    selected2: false
  },
  /*tab切换*/
  selected: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
  },
  /*tab切换*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
  //   const sessionKey = getApp().globalData.sessionkey
  //   http('qsq/service/external/coupon/list', { sessionKey: sessionKey }, 1).then(res => {
  //  console.log(res)
  //     this.setData({
  //       couponList: res
  //     })
  //   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});

function ajax_my_coupon(that) {
  if (!app.globalData.user_id) {
    return;
  }
  /*请求获取个人优惠券start*/
  var post_data = {
    'QueryType': 'my_coupon',
    'UserGuid': app.globalData.UserGuid,
    'Params': '{"orgguid":"' + app.globalData.orgguid + '","openid":"' + app.globalData.user_id + '"}',
    'userguid': app.globalData.user_id
  };
  // console.log(post_data);
  my.httpRequest({
    url: app.globalData.hostname + '/quickProjectAPI',
    data: post_data,
    method: 'POST',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (r) {
      // console.log('---------------------');
      // console.log(r.data);
      // console.log('---------------------');
      my.hideLoading();
      that.setData({
        coupon_new: r.data.coupon_new,
        coupon_lose: r.data.coupon_lose,
        coupon_used: r.data.coupon_used
      });
    },
    fail: function () {
      my.hideLoading();
    }
  });

  /*请求获取个人优惠券end*/
}