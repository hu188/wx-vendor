const app = getApp();
const lg = app.loadUtil();
import {
  http
} from '../../utils/http';
import {
  encode
} from '../../utils/encode';
var userInfo = null;
const setName = {'1': '男', '2':'女', '0':'未知'}

Page({
  data: {
    userInfoOpen: true,
    keyPoolId: app.globalData.id,
    userInfo: null,
    
    
  },


  onLoad(){
   
  },

  onShow: function () {
    let that = this;
    let hasUserInfo = app.globalData.hasUserInfo
    if (!hasUserInfo) {
      that.setData({
        'userInfoOpen' : false
      })
    }
    else {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            'userInfo': res.userInfo,
            'userInfo.gender': setName[res.userInfo.gender]
          })
        }
      })
    }
  },

  //保存用户信息
  // saveAnalysisData: function () {
  //   let that = this
  //   wx.getUserInfo({
  //     success: result => {
  //       let { encryptedData, iv } = result
  //       const params = {
  //         sign: encode({
  //           openid: app.globalData.userInfo.openid,
  //           encryptedData: encryptedData,
  //           iv: iv
  //         }, app.globalData.sessionId),
  //         sessionId: app.globalData.sessionId,
  //         params: {
  //           openid: app.globalData.userInfo.openid,
  //           encryptedData: encryptedData,
  //           iv: iv
  //         }
  //       }
        
  //       http('qsq/miniService/miniProComm/weChatCommon/saveAnalysisData',
  //        param,1,1
  //       ).then(res => {
  //         if (res) {
  //           let userInfo = {nickName: result.userInfo.nickName,
  //               avatarUrl: result.userInfo.avatarUrl,
  //               gender: result.userInfo.gender
  //           }
  //           Object.assign(app.globalData.userInfo, userInfo)
  //           wx.setStorageSync('userInfo', userInfo)
  //         }
  //         else {
  //           // cw.alert('出现错误', 'error');
  //         }
  //       }).catch(res => {
          
  //         userInfo = null;
         
  //       })
  //     }
  //   })
  // },

  //获取用户信息新接口
  agreeGetUser: function (e) {
    let that = this
    if (typeof (e.detail.userInfo) == 'undefined' )  return
    lg.getSessionKey().then( res => {
      if (res) {
        lg.saveAnalysisData()
      }
      app.globalData.oneLoad = false
      app.globalData.hasUserInfo=true
      that.exitOpt()
    })
  },

  exitOpt: function() {
    wx.navigateBack({
      delta : 1
    })
  },
  //取消授权
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  }
  
})