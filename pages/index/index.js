import { request } from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper_list:[],
    catItems:[],
    floorData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSwiperList();
    this.getCatItems();
    this.getFloorData();
  },
  // 实现首页轮播图
  //1. 要来拿到轮播图数据
  //2. 配合使用一下  async await 
  getSwiperList:  async function(e) {
    // wx.request({
    //   url: 'https://www.linweiqin.cn/api/public/v1/home/swiperdata',
    //   success: (res) => {
    //       console.log(res.data.message);
    //       this.setData({
    //         swiper_list:res.data.message
    //       })
    //   }
    // })
    const swiper_list = await request({
      url:"/home/swiperdata"
    });
    this.setData({
      swiper_list
    })

  },
  //获取分类导航数据
  getCatItems: async function(e){
    const catItems = await request({
      url:"/home/catitems"
    });
    this.setData({
      catItems
    })
    console.log(catItems);
  },
  // 获取楼层数据
  getFloorData: async function(e){
    const floorData = await request({
      url:"/home/floordata"
    });
    console.log(floorData);
    this.setData({
      floorData
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