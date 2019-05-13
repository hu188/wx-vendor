import { http } from './utils/http'
App({
  onLaunch(options) {

  },
 
  globalData: {
    userInfo: null,
    user_id: '',//支付宝userid
    projecttitle: '天任售货机平台',
    appid: 'wx978041ffe305d125',
    hostname: 'https://www.tianrenyun.com',
    imgPath: 'https://www.tianrenyun.com/qsqFile/filelib/imagelib/dealerlib/',
    goodsList: [], //结算时选中的商品,
    type: {},
    sessionkey: '',
    auth: false,
    balance: 0,
    deviceId:'',
    classify:'',//设备类型
    userId:'',//用户id
    isVip: '',//1为vip用户
    isFirstBuy:0,//是否第一次购买
    id: '',//小程序id
    sign:'',
    deviceName:'',
    urlType:'',
    url:'',
    tp: '',//0单货单，1多货道
    nickname:'',

  },
});
