var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    id: 0,
    wtao: {},
    displayImages: [],
    imageList: [],
    products: [],
    currentNum: 0,
    initPic: undefined,
    allPopupShow: false
  },
  onShareAppMessage: function(res) {
    var wtao = this.data.wtao
    var title = ''
    var imageUrl = ''
    if(wtao.title != null){
      title = wtao.title
    }else{
      title = wtao.content
    }
    imageUrl = this.data.displayImages[0].src

    return {
      title: title,
      imageUrl: imageUrl,
      path: '/pages/wtao/wtao/wtao?id=' + wtao.id
    }
  },
  onLoad: function(options) {
    if (options.initPic) {
      this.setData({
        initPic: options.initPic
      });
    }
    if (options.id) {
      this.setData({
        id: parseInt(options.id)
      });
      this.getwtaoInfo();
    }
  },
  // 获取商品信息
  getwtaoInfo: function() {
    let that = this;
    util.request(api.SnsWtaoDetail, {
      id: that.data.id
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        var wtao = res.data
        var displayImages = []
        var imageList = []

        if((wtao.type == 1 || wtao.type == 3) && wtao.imageList != null){
          wtao.imageList.forEach(e => {
            var image = {}
            image.src = e
            displayImages.push(image)
            imageList.push(e)

            if(e == that.data.initPic){
              that.setData({
                currentNum: displayImages.length - 1
              })
            }
          });
        }
        
        if((wtao.type == 2 || (wtao.type == 3 && wtao.imageList == null)) && wtao.wtaoProducts != null){
          wtao.wtaoProducts.forEach(p => {
            p.imageList.forEach(e => {
              var image = {}
              image.src = e
              image.product = p
              displayImages.push(image)
              imageList.push(e)

              if(e == that.data.initPic){
                that.setData({
                  currentNum: displayImages.length - 1
                })
              }
            });
          });
        }

        that.setData({
          wtao: wtao,
          displayImages: displayImages,
          imageList: imageList
        });
      }
    });
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
          let userInfo = wx.getStorageSync('userInfo');

          // 点赞处理
          if(actiontype == 1){
            wtao.uped = 1
            wtao.upCt = wtao.upCt + 1

            userInfo.avatar = userInfo.avatarUrl
            userInfo.userId = userInfo.id
            wtao.upVos.unshift(userInfo)
          }else if(actiontype == 2){
            // 取消点赞处理
            wtao.uped = 0
            wtao.upCt = wtao.upCt - 1

            var upVOs = wtao.upVos
            for(var j = 0; j < upVOs.length; j++){
              if(upVOs[j].userId == userInfo.id){
                wtao.upVos.splice(j, 1)
                break
              }
            }
          }
          
          that.setData({
            wtao: wtao
          });
        }
      });
  },
 
  onShow: function() {
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onReady: function() {
    // 页面渲染完成
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
      wx.navigateTo({
        url: naviUrl
      });
    }
  },
  showAllProduct: function(){
    var products = this.data.wtao.wtaoProducts
    if(products.length == 1){
      wx.navigateTo({
        url: "/pages/goods/goods?id=" + products[0].goodsId
      });
      return
    }

    this.setData({
      allPopupShow: true
    })
  },
  onCloseAllProduct: function(){
    this.setData({
      allPopupShow: false
    })
  },
  changeCurrent: function (e) {
    this.setData({
      currentNum: e.detail.current
    })
  },

})