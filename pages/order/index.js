//orderlist.js
// 获取应用实例
const app = getApp();
import common from '../../utils/common';
import {
  http
} from '../../utils/http';
import {
  encode
} from '../../utils/encode';
const {
  $Toast
} = require('../../components/base/index');
Page({
  ...common,
  data: {
    orderlist: [],
    nodatainfo: '',
    pagenum: 0,
    scroll_height: '800px',
    has_more: true, //是否有更多
    showlist: true, //是否显示滚动列表
    systemInfo: {},
    currentOrderType: '',
    currentPageNum: 1,
    selectIndex: 4,
    balance: 0,
    hasUserInfo:''
  },
  onLoad: function(e) {
    wx.hideTabBar()
    this.queryOrder(4);
    this.setData({
      balance: app.globalData.balance,
      hasUserInfo:app.globalData.hasUserInfo
    })
  },

  //根据订单状态获取我的订单
  queryOrder: function(status) {
    if (app.globalData.hasUserInfo){
      let that = this;
      const params = {
        sign: encode({
          cusId: getApp().globalData.userId,
          status: status
        }, app.globalData.sessionId),
        sessionId: app.globalData.sessionId,
        params: {
          cusId: getApp().globalData.userId,
          status: status
        }
      }
      const deviceId = getApp().globalData.deviceId
      http('qsq/miniService/miniProComm/weChatCommon/getSpedingRecord', params, 1, 1).then(res => {
        if (res) {
          let orderList = res.orderList;
          for (var i = 0; i < orderList.length; i++) {
            orderList[i].time = that.formatDateTime(orderList[i].createTime)
          }
          that.setData({
            orderlist: orderList
          })
        }
      })
    }
    
  },
  //格式化时间
  formatDateTime: function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  //订单状态切换
  choseorder: function(event) {
    const {
      value
    } = event.currentTarget.dataset
    this.setData({
      selectIndex: value
    })
    this.queryOrder(value)
  },
  view(e) {
    const {
      orderno,
      money
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../orderDetail/index?orderNo=${orderno}&totalMoney=${money}`,
    })
  },
  send(e) {
    const {
      orderno,
      money
    } = e.currentTarget.dataset
    const params = {
      sign: encode({
        sign: app.globalData.sign,
        appid: app.globalData.id
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        sign: app.globalData.sign,
        appid: app.globalData.id
      }
    }
    http('qsq/service/external/device/queryStatus', JSON.stringify(params), 1, 1).then(res => {
      if (res == '') {
        const params = {
          sign: encode({
            orderNo: orderno
          }, app.globalData.sessionId),
          sessionId: app.globalData.sessionId,
          params: {
            orderNo: orderno
          }
        }
        http('qsq/service/external/order/queryDetail', params, 1, 1).then(res => {
          if (res[0].operateType == 6) {
            //发送报文
            http('qtg/service/external/chat/send', {
              deviceId: app.globalData.deviceId,
              userId: app.globalData.userId,
              orderNo: orderno,
              money: money * 100,
              send: 1
            }, 1).then(res => {})
          } else {
            $Toast({
              content: '出货中',
              type: 'success'
            });
          }
        })
      } else {
        $Toast({
          content: res,
          type: 'error'
        });
      }
    })

  },
  refund(e) {
    const {
      orderno,
      money
    } = e.currentTarget.dataset
    const params = {
      sign: encode({
        orderNo: orderno,
        money: money,
        nickname: app.globalData.nickname,
        deviceName: app.globalData.deviceName
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        orderNo: orderno,
        money: money,
        nickname: app.globalData.nickname,
        deviceName: app.globalData.deviceName
      }
    }
    http('qsq/service/external/refund/orderRefund', params,1, 1).then(res => {
      $Toast({
        content: res,
        type: 'success'
      });
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.queryOrder(this.data.selectIndex);
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },
  onShow() {
    this.queryOrder(this.data.selectIndex)
    this.setData({
      balance: app.globalData.balance
    })
  }

});