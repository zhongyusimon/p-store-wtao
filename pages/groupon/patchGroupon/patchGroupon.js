// pages/groupon/grouponList/grouponList.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouponList: [],
    pageNum: 1,
    pageSize: 10,
    lastPage: false,
    banner: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBannerList()
    this.getGrouponList();
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.resetData()
    this.onLoad()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  resetData: function() {
    this.setData({
      banner: [],
      grouponList: [],
      pageNum: 1
    })
  },
  getBannerList: function() {
    let that = this;
    util.request(api.IndexBanner, {"position": 2})
    .then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          banner: res.data
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getGrouponList: function() {

    let that = this;
    // 页面渲染完成
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    });

    util.request(api.PatchGrouponList, {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }, "POST").then(function(res) {
      if (res.errcode === '0') {

        that.setData({
          grouponList: that.data.grouponList.concat(res.data.list)
        });

        if(res.data.list.length < that.data.pageSize){
          that.data.lastPage = true
        }
      }
      wx.hideToast();
    });

  },
  onReachBottom() {
    if(this.data.lastPage){
      wx.showToast({
        title: '没有更多团购信息了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }else{
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getGrouponList();
    }
  },
  tapBanner: function(e) {
    var ad = e.currentTarget.dataset.ad

    if(ad.linkType == 0){
      return
    }

    if(ad.linkType == 1 && ad.link != ''){
      wx.navigateTo({
        url: ad.link
      })
    }

    if (ad.linkType == 2 && ad.thirdAppid != '' && ad.thirdLink != '') {
      wx.navigateToMiniProgram({
        appId: ad.thirdAppid,
        path: ad.thirdLink,
        success(res) {
          // 打开成功
        }
      })
    }
  }
})