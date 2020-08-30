// pages/goods_detail/index.js
/* 
收藏功能 
1. 点击收藏图标的时候 
  a. 从本地缓存中查看一下是否已经收藏
   a.1 如果已经收藏 取消收藏 图标就恢复未选中状态 
   a.2 如果没有收藏 那么就标记收藏 图标就显示选中状态
2. 如果你是重新进入到这个页面的，那么此时你就要判断一下，商品是否已经
收藏在本地，如果已经收藏，图片显示选中状态；如果未收藏，未选中状态。
-------------------------
商品详情的标题
1. 如果标题的内容小于两行 直接显示
2. 如果标题的内容超过两行 只显示两行 多出的部分用省略号表示
-------------------
图文详情
1. rich-text
2. 富文本内容 在 goods_introduce 里面，直接使用rich-text渲染
----------------------
底部工具栏的实现
1. 点击 联系客服 =》 调用系统的客服功能 =》 button open-type=contact
2. 点击 购物车 => 跳转到购物车 页面 /pages/cart/index
3. 点击 加入购物车   备注：购物车是使用本地缓存来存储购物车数据
   a. 如果该商品已经点击 加入购物车 一次 此时 应该是 购物车里面该商品数量 加一
   b. 如果该商品没有被加入过 添加到本地缓存中 同时设置购物车中 该商品数量为1
4. 点击 立即购买 => 跳转到支付页面 /pages/pay/index

 */

import {
  request
} from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_detail: {}, //用来存详情信息
    isCollect: false // 是否被收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGoodsInfo(options);
  },
  //处理 点击 加入购物车 的逻辑
  handleCartAdd: function(e) {
    //先从缓存中获取一下购物车的信息
    // 加一个空的阈值 判断
    let carts = wx.getStorageSync("carts") || [];
    // 通过findIndex 查看一下carts中有没有当前商品的信息
    let index = carts.findIndex(v => v.goods_id === this.data.goods_detail.goods_id);
    //如果是第一次添加的话 那么 index === -1
    if (index === -1) {
      let goods_detail = this.data.goods_detail;
      goods_detail.num = 1; //第一次添加商品数量就是1
      goods_detail.checked = true; // 后面购物小车会用到 作用是在购物小车的界面默认勾选上这个商品
      // 把商品添加到购物小车中
      carts.push(goods_detail);
    } else {
      // 如果在carts 里面已经存在购物小车信息
      carts[index].num++;
    }
    //重新把购物车信息添加到缓存中
    wx.setStorageSync("carts", carts);
    //提示用户 商品已经被添加到购物车中了
    if (!e.pay) {
      wx.showToast({
        title: '加入成功',
        icon: "success",
        //防止用户乱点 加遮罩
        mask: true
      })
    }
  },
  //定义收藏图标的点击事件
  handleCollect: function(e) {
    // 标识商品是否已经被收藏;默认没有被收藏
    let isCollect = false;
    //从本地缓存中找到收藏的商品信息 本地缓存信息（所有商品）=>collect=>数组
    //如果获取到的collect，所有的商品的收藏信息 
    //为了防止一开始初始化的时候，collect为空，我们这里加一个阈值 [] => 空数组
    // collect 所有商品的收藏信息
    let collect = wx.getStorageSync("collect") || [];
    // 判断一下该商品是否在 collect 中有没有被收藏
    // findIndex使用   https://www.runoob.com/jsref/jsref-findindex.html
    let index = collect.findIndex(v => v.goods_id === this.data.goods_detail.goods_id);
    //index 
    //如果collect 数组已经有收藏商品 index就是它所在的下标
    //如果没有的话 index就是-1 
    if (index != -1) {
      //代表产品之前被收藏过 取消收藏 把商品从collect 中移除
      //splice 移除方法  注意:该方法会修改原数组https://www.runoob.com/jsref/jsref-splice.html
      collect.splice(index, 1);
      // 标识一下 这个商品已经被移除收藏
      isCollect = false;
      //温馨提示一下用户 该商品已经移除收藏
      // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
      wx.showToast({
        title: '取消成功',
        icon: "success",
        mask: true
      })
    } else {
      // 存储到collect 中 this.data.goods_detail 就是返回的商品信息
      collect.push(this.data.goods_detail);
      //同时标识已经被收藏
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: "success",
        mask: true //防止用户乱点 遮罩
      })
    }
    //更新之后的collect 收藏的数组列表 存回本地
    wx.setStorageSync("collect", collect)
    this.setData({
      isCollect
    })
  },

  //获取商品的详情信息
  getGoodsInfo: async function(params) {
    // 1. 发送请求 获取产品详情信息
    const goods_detail = await request({
      url: "/goods/detail",
      data: params
    });
    // 获取一下缓存中的商品收藏信息
    let collect = wx.getStorageSync("collect") || [];
    //判断一下 当前产品是否在 collect 中
    // some  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    let isCollect = collect.some(v => v.goods_id === goods_detail.goods_id);
    console.log(isCollect);
    console.log(goods_detail);
    // 设置 产品信息到 data 属性中
    this.setData({
      goods_detail,
      isCollect
    })
  },
  //处理图片的点击预览事件
  handleImageClick: function(e) {
    //打印事件源
    console.log(e);
    //current 当前点击之后的图片信息
    //pics 就是我们预览的图片列表信息
    const {
      pics,
      current
    } = e.currentTarget.dataset;
    //微信提供的 预览图片功能 
    // 官方文档 https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
    wx.previewImage({
      current: current,
      // 遍历接口里的中等大小的图片
      //urls里面是需要预览的图片http链接列表
      // pics.map(v => v.pics_mid)  返回的数据结构 ["xxx.jpg","xxx1.jpg"] 对的结构
      // pics.map(v=>{v.pics_mid}) 返回的数据结构 [{"xxx.jpg"},{"xxx1.jpg"}] 错的结构
      urls: pics.map(v => v.pics_mid),
    })
  },
  //立即购买
  handleBuy: function() {
    this.handleCartAdd({
      pay: true
    });
    wx.navigateTo({
      url: '/pages/pay/index',
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