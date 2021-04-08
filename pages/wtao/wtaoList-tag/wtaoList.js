var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    wtaoList: [],
    noContent: false,
    hashtagId: null,
    labelId: 0,
    labelName: '',
    label: {},
    pageNum: 1,
    pageSize: 5,
    lastPage: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.hashtagId) {
      this.setData({
        hashtagId: parseInt(options.hashtagId)
      });
    }

    if (options.hashtagName) {
      wx.setNavigationBarTitle({
        title: '#' + options.hashtagName
      })
    }

    this.getwtaoList();
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.resetData();
    this.getwtaoList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  resetData: function() {
    this.setData({
      wtaoList: [],
      pageNum: 1,
      pageSize: 10,
      lastPage: false
    })
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      var wtao = res.target.dataset.wtao
      var title = ''
      var imageUrl = ''
      if(wtao.type == 1 || wtao.type == 2){
        title = wtao.content
        imageUrl = wtao.imageList[0]
      }else if(wtao.type == 3 || wtao.type == 4){
        title = wtao.title
        imageUrl = wtao.coverUrl
      }
      
      return {
        title: title,
        imageUrl: imageUrl,
        path: '/pages/wtao/wtao/wtao?id=' + wtao.id
      }
    }

    return {
      title: '我的世界，我的创作',
      path: '/pages/wtao/wtaoList/wtaoList'
    }
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
  getwtaoList: function() {
    var that = this;

    util.request(api.SnsWtaoList, {
        hashtagId: that.data.hashtagId,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            wtaoList: that.data.wtaoList.concat(res.data.list)
          });

          if(res.data.list.length == 0 && that.data.pageNum == 1){
            that.setData({
              noContent: true
            })
          }

          if(res.data.list.length < that.data.pageSize){
            that.data.lastPage = true
          }
        }
      });
  },
  onReachBottom() {
    if(this.data.lastPage){
      wx.showToast({
        title: '没有更多内容了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }else{
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getwtaoList();
    }
  },
  onUnload: function() {
    // 页面关闭
  },
  upAction(e) {
    var actiontype = e.target.dataset.type;
    var wtao = e.target.dataset.wtao;

    var that = this;

    util.request(api.SnsUpAction, {
        type: 2,
        refId: wtao.id,
        upActionType: actiontype
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          let wtaoList = that.data.wtaoList
          for(var i = 0; i < wtaoList.length; i++){
            if(wtaoList[i].id == wtao.id){
              let userInfo = wx.getStorageSync('userInfo');

              // 点赞操作
              if(actiontype == 1){
                wtaoList[i].uped = 1
                wtaoList[i].upCt = wtaoList[i].upCt + 1

                userInfo.avatar = userInfo.avatarUrl
                userInfo.userId = userInfo.id
                wtaoList[i].upVos.unshift(userInfo)
              }else if(actiontype == 2){
                // 取消点赞
                wtaoList[i].uped = 0
                wtaoList[i].upCt = wtaoList[i].upCt - 1

                var upVOs = wtaoList[i].upVos
                for(var j = 0; j < upVOs.length; j++){
                  if(upVOs[j].userId == userInfo.id){
                    wtaoList[i].upVos.splice(j, 1)
                    break
                  }
                }
              }
              that.setData({
                wtaoList: wtaoList
              });
              break;
            }
          }
          
        }
      });
  },
  // 图片点击事件
  imgTap(e) {
    var nowImgUrl = e.target.dataset.src;
    var tagFrom = e.target.dataset.from;
    if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: tagFrom // 需要预览的图片http链接列表
      })
    }
  },
  linkToHashtag:function(event){
    var hashtag = event.target.dataset.hashtag
    var naviUrl = '/pages/wtao/wtaoList-tag/wtaoList?hashtagId=' + hashtag.id + '&hashtagName=' + hashtag.name

    if(hashtag != null){
      if(this.data.hashtagId == null){
        wx.navigateTo({
          url: naviUrl
        });
      }else{
        wx.redirectTo({
          url: naviUrl
        });
      }
    }

  }
})