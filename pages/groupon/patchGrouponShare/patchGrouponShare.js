var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    orderId: 0,
    grouponInst: {},
    relatedGoods: []
  },
  // 页面分享
  onShareAppMessage: function() {
    let that = this
    var title = this.data.grouponInst.grouponTheme.activityTitle
    
    return {
      title: this.data.grouponInst.grouponTheme.activityTitle,
      path: '/pages/groupon/patchGrouponShare/patchGrouponShare?orderId=' + this.data.orderId
    }
  },
  onLoad: function(options) {
    if (options.orderId) {
      this.setData({
        orderId: parseInt(options.orderId)
      });
    }
    this.getPatchGroupInst()
    this.getGoodsRelated()
  },
  // 获取推荐商品
  getPatchGroupInst: function() {
    let that = this;
    util.request(api.PatchGroupInst, {
      orderId: this.data.orderId
    }).then(function(res) {
      if (res.errcode === '0') {

        var grouponInst = res.data
        var detailList = grouponInst.grouponDetailList
        for(var i = 0; i < grouponInst.totalMembers; i++){
          if(detailList[i] == null){
            detailList[i] = null
          }
        }

        that.setData({
          grouponInst: grouponInst
        });
      }else{
        wx.showModal({
          title: '错误信息',
          content: res.errmsg,
          showCancel: false,
          success (res) {
            wx.switchTab({
              url: "/pages/groupon/patchGroupon/patchGroupon"
            });
          }
        });
      }
    });
  },
  // 获取推荐商品
  getGoodsRelated: function() {
    let that = this;
    util.request(api.PatchGrouponList, {
      pageNum: 1,
      pageSize: 6
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          relatedGoods: res.data.list,
        });
      }
      wx.hideToast();
    });
  },
  fastJoin: function(){
    let that = this;
    //获取用户的登录信息
    if (!app.globalData.hasLogin) {      
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
      return
    }

    //立即购买
    util.request(api.CartFastAdd, {
      goodsId: this.data.grouponInst.grouponDetailList[0].goodsId,
      number: 1,
      productId: this.data.grouponInst.grouponDetailList[0].productId,
    }, "POST")
    .then(function(res) {
      if (res.errcode == '0') {

        // 如果storage中设置了cartId，则是立即购买，否则是购物车购买
        try {
          wx.setStorageSync('cartId', res.data);
          wx.setStorageSync('patchGrouponId', that.data.grouponInst.patchGrouponThemeId);
          wx.setStorageSync('patchGrouponInstId', that.data.grouponInst.id);
          wx.navigateTo({
            url: '/pages/checkout/checkout'
          })
        } catch (e) {}

      } else {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: res.errmsg,
          mask: true
        });
      }
    });
  },
  reBuy: function(){
    let that = this;
    //获取用户的登录信息
    if (!app.globalData.hasLogin) {      
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
      return
    }

    //立即购买
    util.request(api.CartFastAdd, {
      goodsId: this.data.grouponInst.grouponDetailList[0].goodsId,
      number: 1,
      productId: this.data.grouponInst.grouponDetailList[0].productId,
    }, "POST")
    .then(function(res) {
      if (res.errcode == '0') {

        // 如果storage中设置了cartId，则是立即购买，否则是购物车购买
        try {
          wx.setStorageSync('cartId', res.data);
          wx.setStorageSync('patchGrouponId', that.data.grouponInst.patchGrouponThemeId);
          wx.navigateTo({
            url: '/pages/checkout/checkout'
          })
        } catch (e) {}

      } else {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: res.errmsg,
          mask: true
        });
      }
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})