const app = getApp();
import common from '../..//utils/common';
import util from '../../utils/util';
import { encode } from '../../utils/encode';
import {
  http
} from '../../utils/http';
const {
  $Message
} = require('../../components/base/index');
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    orders: [],
    paymentarray: ['微信支付', '余额支付'],
    paymentindex: 0,
    balance: 0,
    deviceName: '',
    totalMoney: '',
    orderNo: '',
    allGoodList: []
  },
  onLoad: function(options) {
    const {
      orderNo,
      totalMoney
    } = options
    this.setData({
      deviceName: app.globalData.deviceName,
      totalMoney: totalMoney,
      orderNo: orderNo
    })

    const params = {
      sign: encode({
        orderNo: orderNo
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        orderNo: orderNo
      }
    }
    http('qsq/service/external/order/queryDetail', params,1, 1).then(res => {
      this.setData({
        orders: res,
      })
    })
    this.setData({
      balance: app.globalData.balance
    })
  },
  pay() {
    if((app.globalData.tp==0 && this.data.orders.length==1) || app.globalData.tp==1){
    //再查询商品
    if (app.globalData.classify.indexOf("FF") != -1) {
      //根据设备id查找商品
      const params = {
        sign: encode({
          deviceId: app.globalData.deviceId
        }, app.globalData.sessionId),
        sessionId: app.globalData.sessionId,
        params: {
          deviceId: app.globalData.deviceId
        }
      }
      http('qsq/service/external/goods/queryGoods',params,1, 1).then(res => {
        //FF类型设备
        var goodsRoadColumn = res[0].goodsRoadColumn;
        var goods = res[0].goodsRoad1;
        var goodsRoadColumns = "[" + goodsRoadColumn + "]";
        var goodsRoadColumnsJson = JSON.parse(goodsRoadColumns)

        for (var i = 0; i < goodsRoadColumnsJson.length; i++) {
          this.data[goodsRoadColumnsJson[i].value] = goodsRoadColumnsJson[i].columnName;
        }
        var arr = [];
        var goodsJson = JSON.parse(goods);
        for (var i = 0; i < goodsJson.length; i++) {
          arr.push(goodsJson[i]);
          arr[i].commodityName = goodsJson[i][this.data.t]; //t:名称
          arr[i].picture = goodsJson[i][this.data.j]; //j:图片
          arr[i].num = goodsJson[i][this.data.n]; //n:数量
          arr[i].valid = goodsJson[i][this.data.i]; //是否有效 非0有效 
          arr[i].goodId = i + 1;
          if (!goodsJson[i][this.data.j] != null) {
            var d = Math.floor(Math.random() * 10000)
            arr[i].id = d;
          }
        }
        this.setData({
          allGoodList: arr
        })
        //查询设备状态（在线、离线、设备忙）
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
        
            const {
              orderNo,
              paymentindex,
              totalMoney,
              balance,
              allGoodList,
              orders
            } = this.data
            //验证商品库存是否充足
            var ts = '';
            for (var j = 0; j < orders.length; j++) {

              const gl = allGoodList.filter(item => item.goodId == orders[j].goodsRoad)
           
               if (gl != '' && gl[0].num - orders[j].cupsNumber < 0) {
                 ts += gl[0].commodityName + ","
               }
          
            }
            ts = ts.substring(0, ts.length - 1)
            if (ts == '') {
              if (paymentindex == 1) {
                //余额支付
                if (totalMoney <= balance) { //余额大于支付金额
                  var devId = app.globalData.classify.indexOf("FF") != -1?app.globalData.deviceId:''
              
                  const params = {
                    sign: encode({
                      orderNo: orderNo,
                      userId: app.globalData.userId,
                      deviceId: devId
                    }, app.globalData.sessionId),
                    sessionId: app.globalData.sessionId,
                    params: {
                      orderNo: orderNo,
                      userId: app.globalData.userId,
                      deviceId: devId
                    }
                  }
                  //余额支付
                  http('qsq/service/external/pay/balancePay', params, 1,1).then(res => {
                    const {
                      id
                    } = res
                    if (id) {
                      app.globalData.goodsList = []
                      $Toast({
                        content: '支付成功',
                        type: 'success'
                      });
                      app.globalData.isFirstBuy = 0

                      const params = {
                        sign: encode({
                          userId: app.globalData.userId
                        }, app.globalData.sessionId),
                        sessionId: app.globalData.sessionId,
                        params: {
                          userId: app.globalData.userId
                        }
                      }
                      http('qsq/service/external/user/updateUser', params,1,1).then(res => {
                        const {
                          chargeMoney
                        } = res
                        this.setData({
                          balance: chargeMoney / 100
                        })
                        app.globalData.balance = chargeMoney / 100
                      })
                      //发送报文
                      http('qtg/service/external/chat/send', {
                        deviceId: app.globalData.deviceId,
                        userId: app.globalData.userId,
                        orderNo: orderNo,
                        money: this.data.totalMoney * 100,
                        send: 0
                      }, 1).then(res => { })
                      wx.clearStorageSync();
                      wx.switchTab({
                        url: '../order/index',
                      })

                    } else {
                      $Toast({
                        content: '支付失败',
                        type: 'error'
                      });
                    }
                  })
                } else { //余额小于支付金额
                  $Toast({
                    content: '余额不足',
                    type: 'error'
                  });
                }
              } else {
                //微信支付
                const params = {
                  sign: encode({
                    userId: app.globalData.userId,
                    orderNo,
                    type: 1,
                    tp: app.globalData.tp,
                    appid: app.globalData.id
                  }, app.globalData.sessionId),
                  sessionId: app.globalData.sessionId,
                  params: {
                    userId: app.globalData.userId,
                    orderNo,
                    type: 1,
                    tp: app.globalData.tp,
                    appid: app.globalData.id
                  }
                }
                http('qsq/service/external/pay/getWeChatPayInfo', params,1,1).then(res => {
                  wx.requestPayment({
                    timeStamp: res.timeStamp + '',
                    nonceStr: res.nonceStr,
                    package: 'prepay_id=' + res.prepay_id,
                    signType: 'MD5',
                    paySign: res.paySign,
                    complete: res => {
                      const {
                        errMsg
                      } = res
                      if (errMsg === 'requestPayment:fail cancel') {
                        $Toast({
                          content: '支付失败',
                          type: 'error'
                        });
                      } else {
                        $Toast({
                          content: '支付成功',
                          type: 'success'
                        });
                        wx.clearStorageSync();
                        app.globalData.goodsList = []
                        wx.switchTab({
                          url: '../order/index',
                        })
                      }
                    }

                  });
                })
              }
            } else {
              $Message({
                content: ts + '库存不足，请重新扫码',
                type: 'error'
              });
            }
          } else {
            $Toast({
              content: res,
              type: 'error'
            });
          }
        })
      })
    }
    }else{
      $Message({
        content: '该设备不支持此订单',
        type: 'error'
      });
    }
  },
  changePay(e) {
    const {
      value
    } = e.detail
    this.setData({
      paymentindex: value
    })
  }

});