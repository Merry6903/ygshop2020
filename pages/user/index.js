// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{} //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从storage里面获取用户的信息
    let userInfo = wx.getStorageSync("userInfo")||{};
    this.setData({
      userInfo
    })
  },
  //获取用户信息
  handleGetUserInfo:function(e){
    console.log(e);
    //1. 放到this.data中
    this.setData({
      userInfo:e.detail.userInfo
    })
    //2. 存到 storage中 页面初始化的时候 可以获取
    wx.setStorageSync("userInfo", e.detail.userInfo);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})