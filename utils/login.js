import {
  http
} from '../utils/http';
import {
  encode
} from '../utils/encode';
/**
 * 获取请求数据的秘钥，查看用户是否授权，授权保存用户信息
 */
const authLoad = function(obj) {
  let that = this
  if (getApp().globalData.oneLoad) {
    loading()
    //获取秘钥
    http('qsq/miniService/miniProComm/weChatCommon/saveSecretKey', {
      keyPoolId: getApp().globalData.id
    }, 1, 1).then(res => {
      
      getApp().globalData.type = {
        type: res.type,
        level_type_id: res.levelTypeId
      }
      getApp().globalData.userInfo = {
        sessionId: res.sessionId
      }
      getApp().globalData.sessionId = res.sessionId
      // 查看用户是否授权，授权保存用户信息
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) { //已授权
            that.getSessionKey().then(r => {
              that.saveAnalysisData() //保存（更新）用户信息
              hideLoading();
              getApp().globalData.oneLoad = false
              getApp().globalData.hasUserInfo = true
              obj.queryDevice(getApp().globalData.sign)
            })
          } else {
            hideLoading();
            getApp().globalData.hasUserInfo = false
            obj.queryDevice(getApp().globalData.sign)
          }
        }
      })
    })
  } else {
    obj.queryDevice(getApp().globalData.sign)
  }

}
/**
 * 保存用户信息
 */
const getSessionKey = function() {
  let that = this
  let promise = new Promise(function(resolve, reject) {
    wx.login({
      success: res => {
        const params = {
          sign: encode({
            code: res.code,
            keyPoolId: getApp().globalData.id
          }, getApp().globalData.sessionId),
          sessionId: getApp().globalData.sessionId,
          params: {
            code: res.code,
            keyPoolId: getApp().globalData.id
          }
        }
        http(
          'qsq/miniService/miniProComm/weChatCommon/wxCommonLogin', params, 1, 1
        ).then(res => {
          const { isVip, id, firstBuy, chargeMoney, optFlag, nickname } = res

          getApp().globalData.userId = id
          getApp().globalData.isVip = optFlag == "0" ? "0" : isVip
          getApp().globalData.balance = optFlag == "0" ? 0 : chargeMoney / 100
          getApp().globalData.nickname = nickname
          const { levelTypeId, type } = res;
          getApp().globalData.type = { level: levelTypeId, type }
          var buyDate = new Date(firstBuy)
          var now = new Date()
          if (buyDate.toLocaleDateString() != now.toLocaleDateString()) {
            getApp().globalData.isFirstBuy = 1
          }
          getApp().globalData.userInfo.id = res.d
          getApp().globalData.userInfo.openid = res.openid
          resolve(res.optFlag)
        })
      }
    })
  })
  return promise
}
//保存用户信息
const saveAnalysisData = function() {
  let that = this
  wx.getUserInfo({
    success: result => {
      let {
        encryptedData,
        iv
      } = result
      const params = {
        sign: encode({
          openid: getApp().globalData.userInfo.openid,
          encryptedData: encryptedData,
          iv: iv
        }, getApp().globalData.sessionId),
        sessionId: getApp().globalData.sessionId,
        params: {
          openid: getApp().globalData.userInfo.openid,
          encryptedData: encryptedData,
          iv: iv
        }
      }
      http('qsq/miniService/miniProComm/weChatCommon/saveAnalysisData',
        params, 1, 1
      ).then(res => {
        if (res) {
          let userInfo = {
            nickName: result.userInfo.nickName,
            avatarUrl: result.userInfo.avatarUrl,
            gender: result.userInfo.gender
          }
          Object.assign(getApp().globalData.userInfo, userInfo)
          wx.setStorageSync('userInfo', userInfo)
        } else {
          // alert('出现错误', 'error');
        }
      }).catch(res => {
        userInfo = null;
      })
    }
  })
}
const loading = function(mask) {
  wx.showLoading({
    title: '加载中...',
    mask: mask
  })
}
const hideLoading = function() {
  wx.hideLoading()
}
//对外开放的函数接口
module.exports = {
  getSessionKey: getSessionKey,
  authLoad: authLoad,
  saveAnalysisData: saveAnalysisData
}