//orderlist.js
// 获取应用实例
const app = getApp();
import common from '../../utils/common';
import { http } from '../../utils/http'
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
  },
  onLoad: function (e) {
    wx.hideTabBar()
    this.queryOrder(4);
    this.setData({
      balance: app.globalData.balance
    })
  },

  //根据订单状态获取我的订单
  queryOrder: function (status) {
    const deviceId =getApp().globalData.deviceId
    const userId = getApp().globalData.userId
    http('qsq/service/external/order/query', { userId, status }, 1).then(res => {
      if(res){
        var pcOrder = {};
        var newRes = [];
        res.find((item, index, arr) => {
            if (item.orderNo && !item.extendMsg) {
              newRes.push(item);
            } else if (item.extendMsg && item.extendMsg.substr(0, 2) == 'PC' && !pcOrder[item.extendMsg]){
              pcOrder[item.extendMsg] = item.extendMsg + '-' + item.money * item.cupsNumber;
              newRes.push(item);
            } else if (item.extendMsg && item.extendMsg.substr(0, 2) == 'PC' && pcOrder[item.extendMsg]){
              const temp = parseFloat(pcOrder[item.extendMsg].split('-')[1]) + item.money * item.cupsNumber;
              pcOrder[item.extendMsg] = item.extendMsg + '-' + temp;
            }
            if (item.extendMsg && newRes[newRes.length - 1].extendMsg == item.extendMsg ) {
              newRes[newRes.length - 1].money = pcOrder[item.extendMsg].split('-')[1];
            }
          }
        ); 
        this.setData({
          orderlist: newRes
        })
        pcOrder = null;
        newRes = null;
      }
    })
  },
 
  //订单状态切换
  choseorder: function (event) {
    const { value } = event.currentTarget.dataset
    this.setData({
      selectIndex: value
    })
    this.queryOrder(value)
  },
  view(e) {
    const { orderno, money} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../orderDetail/index?orderNo=${orderno}&totalMoney=${money}`,
    })
  },
  send(e){
    const { orderno, money} = e.currentTarget.dataset
    http('qsq/service/external/device/queryStatus', { sign: app.globalData.sign, id: app.globalData.id }, 1).then(res => {
    if(res==''){
      http('qsq/service/external/order/queryDetail', { orderNo: orderno }, 1).then(res => {
        if (res[0].operateType==6){
            //发送报文
            http('qtg/service/external/chat/send', {
              deviceId: app.globalData.deviceId,
              userId: app.globalData.userId, orderNo: orderno, money: money * 100, send: 1
            }, 1).then(res => {
            })
        }else{
          $Toast({
            content: '出货中',
            type: 'success'
          });
        }
      })
    }else{
      $Toast({
        content: res,
        type: 'error'
      });
    }
    })
    
  },
  refund(e){
    const { orderno, money } = e.currentTarget.dataset
    http('qsq/service/external/refund/orderRefund', { orderno: orderno, money: money, nickname: app.globalData.nickname,deviceName:app.globalData.deviceName}, 1).then(res => {
      $Toast({
        content: res,
        type: 'success'
      });
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.queryOrder(this.data.selectIndex);
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },
  onShow(){
    this.queryOrder(this.data.selectIndex)
    this.setData({
      balance: app.globalData.balance
    })
  }

});