const app = getApp();
import common from '../../utils/common';
import util from '../../utils/util';
import {
  http
} from '../../utils/http';
import {
  encode
} from '../../utils/encode';
const {
  $Message
} = require('../../components/base/index');

const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    buynum: 1,
    guid: '',
    paymentarray: ['微信支付', '余额支付'],
    couponguid: '',
    cindex: 0,
    goodsList: [],
    order: {},
    orderNo: '',
    totalPrice: 0,
    couponList: [],
    paymentindex: 0,
    couponIndex: 0,
    realPrice: 0,
    balance: 0,
    coupon: {},
    goodId: [], //货道id,
    goodsName: [],
    deviceName: '',
    isVip: 0,
    isFirstBuy: 0,
    allGoodList: [],
  },
  onLoad: function(options) {
    const {
      goodsList
    } = app.globalData
    this.setData({
      goodsList,
      deviceName: app.globalData.deviceName
    })
    let totalPrice = 0
    goodsList.reduce((prev, cur, currentIndex) => {
      if (cur.retailPrice * cur.count - cur.discount > 0) {
        if (app.globalData.isVip == 1 && app.globalData.isFirstBuy == 1) {
          totalPrice += cur.costPrice * cur.count - cur.discount
        } else {
          totalPrice += cur.retailPrice * cur.count - cur.discount
        }
      } else {
        totalPrice += 0.01
      }

    }, 0)
    this.setData({
      totalPrice: totalPrice,
      realPrice: totalPrice,
      balance: app.globalData.balance,
      isVip: app.globalData.isVip,
      isFirstBuy: app.globalData.isFirstBuy
    })

  },
  submitOrderTap: function() {

    ////////////////////
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



        ///////////////



        const {
          goodsList,
          coupon,
          balance,
          paymentindex
        } = this.data

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
          if (paymentindex == 1) {
            this.data.payType = 8
          } else {
            this.data.payType = 7
          }
          //无返回设备状态正常
          if (res == '') {
            //创建预付订单
            if (app.globalData.tp == 0) { //单货道机器
              if (this.data.goodsList[0].goodId) {
                this.data.goodId = this.data.goodsList[0].goodId
              } else {
                this.data.goodId = this.data.goodsList[0].id
              }
              //////
              //验证商品库存是否充足
              var cgood = this.data.allGoodList[this.data.goodId - 1]
              if (cgood.num > 0) {
                const params = {
                  sign: encode({
                    deviceId: app.globalData.deviceId,
                    userId: app.globalData.userId,
                    goodId: this.data.goodId,
                    goodName: this.data.goodsList[0].commodityName,
                    money: this.data.realPrice,
                    payType: this.data.payType,
                    num: this.data.goodsList.length,
                    nickname: app.globalData.nickname,
                    isVip: this.data.isVip,
                    isFirstBuy: this.data.isFirstBuy
                  }, app.globalData.sessionId),
                  sessionId: app.globalData.sessionId,
                  params: {
                    deviceId: app.globalData.deviceId,
                    userId: app.globalData.userId,
                    goodId: this.data.goodId,
                    goodName: this.data.goodsList[0].commodityName,
                    money: this.data.realPrice,
                    payType: this.data.payType,
                    num: this.data.goodsList.length,
                    nickname: app.globalData.nickname,
                    isVip: this.data.isVip,
                    isFirstBuy: this.data.isFirstBuy
                  }
                }
                //http('qsq/service/external/order/saveOrderInfo', JSON.stringify(params), 1, 1).then(res => {
                http('qsq/miniService/miniProComm/weChatCommon/saveOrderInfo', JSON.stringify(params), 1, 1).then(res => {
                  this.setData({
                    order: res
                  })
                  this.pay(res.orderNo)
                })
              } else {
                $Message({
                  content: '库存不足，请重新扫码',
                  type: 'error'
                });
              }
              //////

            } else { //多货道机器
              const {
                goodsList,
                allGoodList
              } = this.data
              //验证商品库存是否充足
              var ts = '';
              for (var j = 0; j < goodsList.length; j++) {
                const gl = allGoodList.filter(item => item.goodId == goodsList[j].goodId)
                if (gl[0].num - goodsList[j].count < 0) {
                  ts += gl[0].commodityName + ","
                }
              }
              ts = ts.substring(0, ts.length - 1)

              if (ts == '') {
                const params = {
                  sign: encode({
                    goodsList: JSON.stringify(goodsList),
                    deviceId: app.globalData.deviceId,
                    userId: app.globalData.userId,
                    payType: this.data.payType,
                    nickname: app.globalData.nickname,
                    isVip: this.data.isVip,
                    isFirstBuy: this.data.isFirstBuy,
                    tp: app.globalData.tp
                  }, app.globalData.sessionId),
                  sessionId: app.globalData.sessionId,
                  params: {
                    goodsList: JSON.stringify(goodsList),
                    deviceId: app.globalData.deviceId,
                    userId: app.globalData.userId,
                    payType: this.data.payType,
                    nickname: app.globalData.nickname,
                    isVip: this.data.isVip,
                    isFirstBuy: this.data.isFirstBuy,
                    tp: app.globalData.tp
                  }
                }
             // http('qsq/service/external/order/saveOrderInfo', JSON.stringify(params), 1, 1).then(res => {
                http('qsq/miniService/miniProComm/weChatCommon/saveOrderInfo', JSON.stringify(params), 1, 1).then(res => {
                  this.setData({
                    order: res
                  })
                  //this.pay(res.extendMsg)
                  this.pay(res.orderNo)
                })
              } else {
                $Message({
                  content: ts + '库存不足，请重新扫码',
                  type: 'error'
                });
              }

            }

            //显示设备错误状态信息（离线、设备忙）
          } else {
            $Toast({
              content: res,
              type: 'error'
            });
          }
        })
      })
    }
  },
  pay(orderNo) {

    const {
      paymentindex,
      balance,
      totalPrice
    } = this.data
    if (paymentindex == 1) { //余额支付
      if (totalPrice <= balance) { //余额大于支付金额
        if (app.globalData.classify.indexOf("FF") != -1) {
          var balancepay = {
            sign: encode({
              orderNo: orderNo,
              userId: app.globalData.userId,
              deviceId: app.globalData.deviceId
            }, app.globalData.sessionId),
            sessionId: app.globalData.sessionId,
            params: {
              orderNo: orderNo,
              userId: app.globalData.userId,
              deviceId: app.globalData.deviceId
            }
          }
     
        } else {
          var balancepay = {
            sign: encode({
              orderNo: orderNo,
              userId: app.globalData.userId,
              deviceId: ''
            }, app.globalData.sessionId),
            sessionId: app.globalData.sessionId,
            params: {
              orderNo: orderNo,
              userId: app.globalData.userId,
              deviceId: ''
            }
          }
        }
        //余额支付
        http('qsq/service/external/pay/balancePay', JSON.stringify(balancepay), 1, 1).then(res => {
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
            http('qsq/service/external/recharge/queryBalance', JSON.stringify(params), 1, 1).then(res => {
              //qsq/service/external/user/updateUser
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
              money: this.data.totalPrice * 100,
              send: 0
            }, 1).then(res => {})
     //       wx.clearStorageSync();
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
      const params = {
        sign: encode({
          userId: app.globalData.userId,
          orderNo,
          type: 1,
          tp: app.globalData.tp,
          keyPoolId: app.globalData.id,
          notifyUrl: 'NOTIFYURL_1',
        }, app.globalData.sessionId),
        sessionId: app.globalData.sessionId,
        params: {
          userId: app.globalData.userId,
          orderNo,
          type: 1,
          tp: app.globalData.tp,
          keyPoolId: app.globalData.id,
          notifyUrl: 'NOTIFYURL_1',
        }
      }
      //微信支付 qsq/miniService/miniProComm/weChatCommon/
     // http('qsq/service/external/pay/getWeChatPayInfo', params, 1,1).then(res => {
      http('qsq/miniService/miniProComm/weChatCommon/saveCommonPay', params, 1, 1).then(res => {
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
         //     wx.clearStorageSync();
              app.globalData.goodsList = []
              wx.switchTab({
                url: '../order/index',
              })
            }
          }
        });

      })
    }
  },
  bindCouponChange(e) {
    const {
      value
    } = e.detail
    let {
      totalPrice
    } = this.data
    this.setData({
      couponIndex: value
    })
    let {
      balance
    } = app.globalData
    totalPrice -= balance
    if (value * 1 > 0) {
      const {
        couponList
      } = this.data
      const coupon = couponList[value]
      const {
        couponType,
        discount
      } = coupon
      if (couponType * 1 === 1) { //折扣券
        totalPrice -= totalPrice - totalPrice * discount * 0.01
      } else { //抵用券
        totalPrice = totalPrice - discount
      }
      this.setData({
        realPrice: totalPrice,
        coupon: coupon
      })
    } else {
      this.setData({
        realPrice: totalPrice,
        coupon: {}
      })
    }
  },
  bindPaymentChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      paymentindex: value
    })
  }
});