// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseImages: [], //选中的图片列表
    upload_img_count: 0
  },
  //清除选择的图片
  handleRemoveImage: function(e) {
    //获取当前选中的图片的索引
    const {
      index
    } = e.currentTarget.dataset;
    //获取当前的图片列表
    let {
      chooseImages
    } = this.data;
    //删除当前选择图片
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    })
  },
  //处理添加图片的逻辑
  handleChooseImage: function(e) {
    //wx.chooseImage
    //https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        this.setData({

          chooseImages: [...this.data.chooseImages,...res.tempFilePaths]

        })
      }
    })


  },
  //处理图片上传的逻辑
  handleFormSubmit: function(e) {
    // 首先获取图片列表
    const {
      chooseImages
    } = this.data;
    //如果选择图片的长度为0 提示用户 图片为0 
    //图片合法校验
    if (!chooseImages.length) {
      wx.showToast({
        title: '没有可以上传的图片',
        icon: "none",
        mask: true
      });
      return;
    }
    //提示用户图片正在上传
    wx.showLoading({
      title: '图片正在上传中......',
      mask: true
    });
    //开始上传图片 图片上传只能一张一张上传
    //wx.uploadFile
    //https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html

    chooseImages.forEach((v, i) => {
      wx.uploadFile({
        url: 'https://images.ac.cn/Home/Index/UploadAction/', //新浪图床
        filePath: v,
        name: 'file',
        formData: {},
        success:(res)=> {
          console.log(res);
          //判断是否所有图片均已上传成功
          if (i === chooseImages.length - 1) {
            wx.hideLoading();
            console.log("图片均已上传");
            this.setData({
              upload_img_count: i + 1
            })
            //跳转回上一页面
            wx.navigateBack({
              delta: 1
            })
          } else {
            this.setData({
              upload_img_count: i + 1
            })
          }
        }
      })
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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

  }
})