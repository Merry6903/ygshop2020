// pages/search/index.js
import {
  request
} from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "", //用来存放输入框的值
    goods_list: [
      // {
      //   "goods_id": 57444,
      //   "goods_name": "创维（Skyworth）42X6 42英寸10核智能酷开网络平板液晶电视（黑色）"
      // },
      // {
      //   "goods_id": 57444,
      //   "goods_name": "创维（Skyworth）42X6 42英寸10核智能酷开网络平板液晶电视（黑色）"
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  handleInputChange: function(e) {
    // console.log(e.detail.value);
    this.setData({
      inputVal: e.detail.value
    })
  },
  // 处理点击事件
  handleSearch: async function(e) {
    const {
      inputVal
    } = this.data;
    console.log(inputVal);
    //判断输入商品名称是否为空
    if (!inputVal) {
      wx.showToast({
        title: '输入商品名称不能为空',
        icon: "none"
      })
      return false;
    }
    //请求后台拿数据
    const goods_list = await request({
      url: "/goods/qsearch",
      data: {
        query: inputVal
      }
    })
    //判断一下goods_list 是否为空
    if (goods_list.length === 0) {
      wx.showToast({
        title: "查无数据",
        icon: "none"
      })
    }
    this.setData({
      goods_list
    })
    console.log(goods_list);

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