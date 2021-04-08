var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    relatedGoods: []
  },
  onLoad: function(options) {
    this.getGoodsRelated()
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