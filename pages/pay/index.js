// pages/pay/index.js
/* 
handleAddressChoose 获取用户当前的收货地址
1. 获取用户当前的setting 看setting有没有 获取地址的权限
  a. 如果没有权限 打开微信 setting 设置获取地址权限
  b. 如果有权限 直接选择地址就可以了 wx.chooseAdress
2. 拼接当前地址 用户收货地址  address.all =  provinceName cityName countyName detailInfo
3. 获取到的地址设置到缓存 storage 还有 data中

*******************************
handlePay 在本应用 微信支付流程
A. 环境的准备
   a.1 如果你是使用 https://www.linweiqin.cn/api/public/v1 接口的同学
   appId = wx45f217ba2cb42557
   同时把你的微信号 给到 林老师 =》 微信后台添加到开发者账号 
   a.2 如果你是使用第三方平台提供的支付接口，就去平台看对应配置文档
  
B. 微信支付流程 
1. 获取 token => openID 唯一标识  
接口：https://www.showdoc.cc/128719739414963?page_id=2612400282844951
2. 在系统中创建一个订单 
接口 ：https://www.showdoc.cc/128719739414963?page_id=2612148628877795
3. 获取支付参数
接口：https://www.showdoc.cc/128719739414963?page_id=2612486239891213
4. 发起支付  wx.requestPayment
https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
5. 查询是否支付成功
接口：https://www.showdoc.cc/128719739414963?page_id=2612723166377091
6. 把本地缓存中 carts 已经支付的商品 删除
7. 跳转到订单查询页面 /pages/order/index

 */
import {
  getSetting,
  openSetting,
  chooseAddress,
  requestPayment,
  showToast
} from "../../utils/asyncWx.js"
import {
  request
} from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //address.all => true 直接渲染收货地址
    //address.all => false 直接渲染 选择地址功能
    address: {}, //存收货信息 
    carts: [], //购物小车数据
    totalPrice: 0, //总价
    totalNum: 0 //总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取购物车小车商品内容 carts
    let carts = wx.getStorageSync("carts") || [];
    //获取当前选择的地址
    let address = wx.getStorageSync("address") || {};
    //通过 setCarts初始化购物小车数据
    this.setCarts(carts);
    this.setData({
      address
    })
  },
  // 处理微信支付的流程
  handlePay: async function(e) {
    try {
      //1. 获取token => openID 用户的唯一标识
      let token = wx.getStorageSync("token");
      //如果本地缓存中没有token,此时我们就需要跳转去授权页面获取token
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
      }
      //开始支付流程
      //2. 创建系统订单 
      //开始拼接创建订单需要的 请求参数
      let order_price = this.data.totalPrice;
      let consignee_addr = this.data.address.all;
      let goods = [];
      //获取goods 的参数列表
      this.data.carts.forEach(v => {
        //判断购物小车是否被选中
        if (v.checked) {
          let params = {};
          params["goods_id"] = v.goods_id;
          params["goods_number"] = v.num;
          params["goods_price"] = v.goods_price;
          goods.push(params);
        }
      })
      //订单的请求参数
      let order_params = {
        order_price: order_price,
        consignee_addr: consignee_addr,
        goods: goods
      }
      //创建订单
      const {
        order_number
      } = await request({
        url: "/my/orders/create",
        method: "post",
        data: order_params
      });
      // console.log(order_number);
      //3. 获取支付参数
      const {
        pay
      } = await request({
        url: "/my/orders/req_unifiedorder",
        method: "POST",
        data: {
          order_number
        }
      });
      //console.log(pay);
      // 4.发起支付 wx.requestPayment //https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html 
      //https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
      await requestPayment(pay);
      //5. 查询一下订单状态
      let res = await request({
        url: "/my/orders/chkOrder",
        method: "post",
        data: {
          order_number
        }
      });
      //提示用户 支付成功
      await showToast({
        title:"支付成功"
      });
      //6 手动删除已经支付的商品信息
      let newCarts = wx.getStorageSync("carts")||[];
      //!v.checked 没有被选中支付的商品
      newCarts = newCarts.filter(v=>!v.checked)
      //设置回本地缓存
      wx.setStorageSync("carts", newCarts);
      //7. 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })

    } catch (e) {
      console.log(e);
      //提示用户 支付失败
      showToast({
        title:"支付失败"
      })
    }

  },
  //重新选择地址
  handleAddressChange: async function(e) {
    //捕捉各种获取权限过程中可能出现的异常
    try {
      //获取用户的地址 wx.chooseAddress
      let address = await chooseAddress();
      //拼接地址
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存到缓存和 this.data中
      wx.setStorageSync("address", address);
      this.setData({
        address
      })
    } catch (e) {
      console.log(e);

    }
  },

  // 获取用户的收货地址
  // wx.chooseAddress 接口
  handleAddressChoose: async function(e) {
    //捕捉各种获取权限过程中可能出现的异常
    try {
      //通过 wx.getSetting获取当前用户拥有的权限
      //https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
      const setting = await getSetting();
      // 判断一下用户有没有获取当前地址的权限 scope.address
      //打开微信的权限设置 看能不能直接设置地址权限
      if (!setting.authSetting["scope.address"]) {
        //打开设置授权页面
        await openSetting();
      }
      //获取用户的地址 wx.chooseAddress
      let address = await chooseAddress();
      //拼接地址
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存到缓存和 this.data中
      wx.setStorageSync("address", address);
      this.setData({
        address
      })
      console.log(address);

      console.log(setting);
    } catch (e) {
      console.log(e);

    }
  },
  //作用 
  //1. 设置购物小车的值
  //2. 计算选中商品的价格
  //3 计算选中商品的数量
  setCarts: function(carts) {
    let totalNum = 0; //商品的数量
    let totalPrice = 0; //商品的价格
    console.log(carts);
    //对购物小车做循环 找到 checked 为true 的项  把价格和数量相加
    carts.forEach(v => {
      if (v.checked) {
        totalNum += v.num; //商品数量总和
        totalPrice += v.num * v.goods_price;
      }
    })
    this.setData({
      carts,
      totalNum,
      totalPrice
    })
  },
  // 获取用户的收货地址
  // wx.chooseAddress 接口
  handleAddressChoose: async function(e) {
    //捕捉各种获取权限过程中可能出现的异常
    try {
      //通过 wx.getSetting获取当前用户拥有的权限
      //https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
      const setting = await getSetting();
      // 判断一下用户有没有获取当前地址的权限 scope.address
      //打开微信的权限设置 看能不能直接设置地址权限
      if (!setting.authSetting["scope.address"]) {
        //打开设置授权页面
        await openSetting();
      }
      //获取用户的地址 wx.chooseAddress
      let address = await chooseAddress();
      //拼接地址
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存到缓存和 this.data中
      wx.setStorageSync("address", address);
      this.setData({
        address
      })
      console.log(address);

      console.log(setting);
    } catch (e) {
      console.log(e);

    }
  },
  //作用 
  //1. 设置购物小车的值
  //2. 计算选中商品的价格
  //3 计算选中商品的数量
  setCarts: function(carts) {
    let totalNum = 0; //商品的数量
    let totalPrice = 0; //商品的价格
    console.log(carts);
    //对购物小车做循环 找到 checked 为true 的项  把价格和数量相加
    carts.forEach(v => {
      if (v.checked) {
        totalNum += v.num; //商品数量总和
        totalPrice += v.num * v.goods_price;
      }
    })
    this.setData({
      carts,
      totalNum,
      totalPrice
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