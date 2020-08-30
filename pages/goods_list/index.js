// pages/goods_list/index.js
import {
  request
} from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "综合",
      isActive: true
    }, {
      id: 1,
      value: "销量",
      isActive: false
    }, {
      id: 2,
      value: "价格",
      isActive: false
    }],
    goods: [] // 搜索的商品列表
  },
  QueryParams: {
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 0,
  // 处理tabs 传过来的参数 tabs 存在 e.detail
  handleTabsChange: function(e) {
    this.setData({
      tabs: e.detail
    })
  },
  //获取列表数据
  getGoodsList: async function() {
    const goods_list = await request({
      url: "/goods/search",
      data: this.QueryParams
    })
    // 总共有多少页
    this.totalPages = Math.ceil(goods_list.total / this.QueryParams.pagesize);
    this.setData({
      //追加
      goods: [...this.data.goods,...goods_list.goods]
    })
    //关闭下拉提示圈
    wx.stopPullDownRefresh();
    console.log(this.data.goods);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //cid query

    /* 
   PageObject[] getCurrentPages()
  获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
   注意：
 不要尝试修改页面栈，会导致路由以及页面状态错误。
 不要在 App.onLaunch 的时候调用 getCurrentPages()，此时 page 还没有生成。
     */
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    const {
      cid,
      query
    } = currentPage.options;
    //     const {
    //   cid,
    //   query
    // } = options;
    //如果页面有传 cid 参数过来
    if (cid) {
      this.QueryParams["cid"] = cid;
    }
    if (query) {
      this.QueryParams["query"] = query;
    }
    this.getGoodsList();
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
  // 下拉 重新加载数据
  onPullDownRefresh: function() {
    //1. 清空原有的goods=[]
    this.setData({
      goods: []
    })
    //2 把页面重置为1
    this.QueryParams.pagenum = 1;
    //重新发起请求
    this.getGoodsList();
  },

  /**handleTabsChange
   * 
   * 
   * 页面上拉触底事件的处理函数
   */
  //触底 加载下一页
  onReachBottom: function() {
    if (this.totalPages >= this.QueryParams.pagenum) {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    } else {
      wx.showToast({
        title: '已经没有下一页的数据了',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})