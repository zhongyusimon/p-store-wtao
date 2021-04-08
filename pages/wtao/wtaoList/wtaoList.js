var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    adMap: {},
    wtaoList: [],
    noContent: false,
    hashtagId: null,
    labelId: 0,
    labelName: '',
    label: {},
    pageNum: 1,
    pageSize: 5,
    lastPage: false,
    typeMap:{
      1: {'text': '动态', 'color': null},
      2: {'text': '上新', 'color': '#FF9933'},
      3: {'text': '种草', 'color': '#99CC00'},
      4: {'text': '文章', 'color': null},
      5: {'text': '视频', 'color': null},
      6: {'text': '评论', 'color': null},
      7: {'text': '活动', 'color': '#FF6600'},
      8: {'text': '直播', 'color': '#006699'}
    },
    type: 0,
    picShow: false
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
    this.getAdData();
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.resetData();
    this.getwtaoList();
    this.getAdData();
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
      if(wtao.title != null){
        title = wtao.title
      }else{
        title = wtao.content
      }

      if(wtao.type == 1 && wtao.imageList != null){
        imageUrl =  wtao.imageList[0]
      }else if((wtao.type == 2 || wtao.type == 3) && wtao.wtaoProducts != null && wtao.wtaoProducts[0].imageList != null){
        imageUrl =  wtao.wtaoProducts[0].imageList[0]
      }else if(wtao.type == 4){
        imageUrl =  wtao.coverUrl
      }else if(wtao.type == 5 && wtao.videoList != null){
        imageUrl =  wtao.videoList[0].coverUrl
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
  getAdData: function() {
    let that = this;
    util.request(api.AdMap,{
      codeList: ['wtao']
    }, 'POST').then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          adMap: res.data
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
  getwtaoList: function() {
    var that = this;

    util.request(api.SnsWtaoList, {
        hashtagId: that.data.hashtagId,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize,
        types: this.data.type == 0 ? [] :[this.data.type] 
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
  tapTypeTab(e){
    var type = e.target.dataset.type;

    this.setData({
      type: type
    })

    this.resetData();
    this.getwtaoList();
  },
  upAction(e) {
    var actiontype = e.target.dataset.type;
    var wtao = e.target.dataset.wtao;

    var that = this;

    util.request(api.SnsUpAction, {
        type: 4,
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
    var wtao = e.target.dataset.wtao;
    var src = e.target.dataset.src;
    var redirect = '/pages/wtao/wtaoPreview/wtaoPreview?id=' + wtao.id
    if(src != null){
      redirect = redirect +"&initPic=" + src
    }

    wx.navigateTo({
      url: redirect
    });
  },
  onClickHide() {
    this.setData({ picShow: false });
  },
  goDetail(e){
    var wtao = e.currentTarget.dataset.wtao;

    if(wtao.type == 5){
      wx.navigateTo({
        url: '/pages/wtao/wtaoPreview/wtaoPreview?id=' + wtao.id
      });
      return
    }

    wx.navigateTo({
      url: '/pages/wtao/wtao/wtao?id=' + wtao.id
    });
  },
  linkToHashtag:function(event){
    // var hashtag = event.target.dataset.hashtag
    // var naviUrl = '/pages/wtao/wtaoList-tag/wtaoList?hashtagId=' + hashtag.id + '&hashtagName=' + hashtag.name

    // if(hashtag != null){
    //   if(this.data.hashtagId == null){
    //     wx.navigateTo({
    //       url: naviUrl
    //     });
    //   }else{
    //     wx.redirectTo({
    //       url: naviUrl
    //     });
    //   }
    // }

  }
})