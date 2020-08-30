// pages/order/index.js
import {
  request
} from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
      id: 0,
      value: "全部",
      isActive: true,
      type: 1,
    }, {
      id: 1,
      value: "待付款",
      isActive: false,
      type: 2,
    }, {
      id: 2,
      value: "待发货",
      isActive: false,
      type: 3, //订单类型
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderList();
  },
  //获取订单数据
  getOrderList: async function() {
    //找到现在被激活的菜单
    let activeTab = this.data.tabs.filter(v => v.isActive);
    // 请求 拿到对应 type 的数据
    let res = await request({
      url: "/my/orders/all",
      data: {
        type: activeTab[0].type
      }
    })
    this.setData({
      orders: res.orders.map(v => ({
        ...v,
        create_time_cn: (new Date(v.create_time * 1000).toLocaleString())
      }))
    }, function() {
      console.log(this.data.orders);
    })
  },
  //tabs 菜单的监听事件 用于子向父传值
  handleTabsChange(e) {
    let tabs = e.detail;
    // {
    //   id: 2,
    //     value: "待发货",
    //       isActive: false,
    //         type: 3, //订单类型  之前tabs里面没有 type 
    // }
    tabs.map((v, index) => v.type = index + 1);
    this.setData({
      tabs: tabs
    })
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