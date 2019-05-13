//health.js
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '加载中......',
    userInfo: {},
    healthInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  unBindTap: function(event) {
     var that = this;
      wx.showModal({
        title: '解绑提示',
        content: '您确定要解绑此手机号吗？',
        success: function(res) {
          if (res.confirm) {
            var post_data = {
              orgguid: '88',
              wxid: 'oWgn7wFFganEr-MNv5DZ80mGuTeA',
              phone: that.data.phonenum
            };

            wx.request({
            url: 'https://mshop.yiyao365.cn/yunuo_health/healthAPI/unbind_member',
            data: post_data,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { 'content-type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
            success: function(res){
              wx.showToast({
                title: '解绑成功!',
                icon: 'success',
                duration: 3500,
                success: function() {
                    var html = '<navigator url="../health/bindmember">您还没有绑定手机号，请先绑定</navigator>';
                    WxParse.wxParse('record','html',html,that);
                }
            });
            }
            });
          }
        }
      });
  },
  goBindMemberTap: function(event) {
      wx.navigateTo({
        url: 'bindmember',
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  onLoad: function () { 
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });

    var post_data = {
      orgguid: app.globalData.orgguid,
      wxid: 'oWgn7wFFganEr-MNv5DZ80mGuTeA'
    };

    wx.request({
      url: 'https://mshop.yiyao365.cn/yunuo_health/healthAPI',
      data: post_data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
      success: function(res){
        if(res.data.is_member == 1) {
            that.setData({unbindtxt: '解绑'});
            that.setData({bindevent: 'unBindTap'});
            that.setData({phonenum: res.data.phone});
        } else {
            that.setData({unbindtxt: '绑定'});
            that.setData({bindevent: 'goBindMemberTap'});
        }

        if(res.data.is_member == 1 && res.data.phy != null) {
          var phy_data = res.data.phy;
			    var html =	'<div class="list-title">自测数据：'+phy_data.DBP.CREATEDATE+'</div>';
            for ( var v in phy_data ){   
					    html += '<div class="lists">';
					// 	<a href="<?=base_url()?>yunuo_health/index/trend?key=<?=$k1?>&typename=<?php if($k1 == 'DBP') echo '血压'; else echo $v1['NAME'];?>&physical_type=phy">
							  html += '<div class="lists-title">';
								  html += '<ul>';
                    if(v == 'DBP') {
                      var temp ='血压';
                    } else {
                      var temp= phy_data[v].NAME;
                    }
									  html+= '<li>'+temp;
                    var createdate = phy_data[v].CREATEDATE;
                    html+='<span>'+createdate+'</span>';
                    html+='</li>';
                    if(v != 'DBP') {
                      html+='<li>'+phy_data[v].VALUE;
                      html+='<span style="color: #0289d1;">';
                      html+=phy_data[v].NOTE+'</span></li>';
                    }
            						
						  	  html+='</ul>';
						  	html+='</div>';
							  html+='<div class="lists-content">';
							
					// 			<!-- 如果列表是一列的时候在class为lists-right-right后面调用lists-juf,隐藏lists-right-left -->
								if(v == 'DBP') {
								html+='<div class="lists-right">';
								html+='<div class="lists-right-left">';
										html+='<ul>';
											html+='<li>收缩压</li><li>';
											if(v == 'DBP') {
                        html+= isNaN(phy_data[v].SBP)?'-- ':phy_data[v].SBP;
                      } else {
                        html+= isNaN(phy_data[v].VALUE)?'-- ':phy_data[v].VALUE;
                        }
                        html+=phy_data[v].NOTE+'</li>';
										html+='</ul>';
								html+='</div>';
									html+='<div class="lists-right-right">';
										html+='<ul>';
										html+='<li>舒张压</li><li>';
											if(v == 'DBP') {
                        html+= isNaN(phy_data[v].DBP)?'-- ':phy_data[v].DBP;
                      } else {
                        html+=isNaN(phy_data[v].VALUE)?'-- ':phy_data[v].VALUE;
                        }
                        html+=phy_data[v].NOTE+'</li>';
										html+='</ul>';
									html+='</div>';
								html+='</div>';
								} else {

          }
							
							html+='</div>';
						html+='</a>';
					html+='</div>';
					}
					
         WxParse.wxParse('record','html',html,that);
        } else {
           var html = '<view bindtap="goBindMemberTap">您还没有绑定手机号，请先绑定</view>';
           WxParse.wxParse('record','html',html,that);
        }   
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    }); 
  }
})
