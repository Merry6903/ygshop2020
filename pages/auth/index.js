// pages/auth/index.js
import { login } from "../../utils/asyncWx.js"
import { request } from "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
// 就是授权之后的用户信息 会通过事件源 e.detail 传递过来
  handleUserInfo: async function(e){
    console.log(e);
    try{
      //通过button 获取到的参数信息
      // encryptedData, iv, rawData, signature
      let {
        encryptedData, iv, rawData, signature
      }  = e.detail;
    //通过 wx.login 获取 code 参数
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
      let { code } = await login();
      //console.log(code);
      //发请求 获取token 数据 
      const res = await request({
        url:"/users/wxlogin",
        method:"POST", //post
        data:{
          encryptedData, iv, rawData, signature,code
        }
      });
      console.log(res);
      //存到本地缓存中
      wx.setStorageSync("token", res.token);
      //返回上一个页面
      wx.navigateBack({
        delta:1
      })
    }catch(e){
      console.log(e);
    }
  },
  //处理获取用户收货地址接口
  handleAddressChoose:function(e){
    wx.chooseAddress({
      success(res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  //获取用户登录凭证
  //https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
  handleLogin:function(e){
    wx.login({
      timeout:100*1000,
      success:function(res){
        console.log(res);
      }
    })
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