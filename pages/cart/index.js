// pages/cart/index.js
/* 
  A. 获取购物车初始化数据 => 在onShow 中获取
  1. 从本地缓存中获取购物车的缓存数据 key = "carts"
   如果获取的结果是空，那么直接返回一个空数组
  2. 获取方式 通过wx.getStorageSync("carts")
 https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html
***************************************
B. 实现空白购物车 
    1. "去逛逛" =》 跳转到分类商品页面
    2. 温馨提示的信息内容
****************************************
购物车列表的选中事件 handleCheck
1. 获取当前被点击列表的 唯一标识  goods_id
2. 获取当前的购物小车列表 carts
3. 对购物车小车列表 carts 进行循环 找到 goods_id 对应的 item
4. item.checked = ! item.checked
5. 再把最新的cart 通过 setCart 方法设置回去 
****************************************
购物车全选逻辑 handleAllChecked
1. 获取一下当前全选的状态 => allChecked => 值只有两个 true|false
2. 获取当前购物车列表数据 carts
3. allChecked = !allChecked
4. 对购物车里面的数据 carts 进行循环 v.checked = allChecked
5. 调用 setCart 方法将 carts 数据存回去

****************************************
setCart 数据处理逻辑
A. allChecked 的处理逻辑
1. allChecked 如果购物车里面的购物车数据 v.checked 属性都为true => allChecked = true
2. 其它情况下 allChecked = false
B. totalPrice 处理逻辑
1. 获取购物车列表 carts
2. 循环carts 找到到 v.checked 为真的 item
3. totalPrice = sum(v.num * v.goods_price) 所有checked 为true 
的商品 的数量X价格 的总和
C.totalNum 处理逻辑
1. 获取购物车列表 carts
2. 循环carts 找到到 v.checked 为真的 item
3. totalNum  = sum(v.num) 所有checked 为true
的商品 的数量 的总和
****************************************
handleOperation 处理购物小车的加减逻辑
1. 当点击 + 的时候，那么就是商品数量+1
2. 当点击 - 的时候
   a.目前商品数量大于0，直接减1
   b.当商品数量等于0，提示用户是否要删除本商品，如果确定，直接
   删除；如果取消，本操作取消。
 */
import { showModal  } from "../../utils/asyncWx.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts:[], //购物小车的数据
    allChecked:false, //默认购物车里面的商品都是被选中的
    totalNum:0, //选中商品的数量
    totalPrice:0 //选中的商品价格总和
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取是空，直接返回空数组
      let carts = wx.getStorageSync("carts")||[];
      this.setCart(carts);
  },
  //处理购物小车的加减逻辑
  handleOperation: async function(e){
    //获取点击列表的参数 goods_id operation
    const { goods_id,operation } = e.currentTarget.dataset;
    //获取一下本地缓存中的购物车信息
    const carts = wx.getStorageSync("carts");
    //找一下 点击的商品 在carts中的位置 index
    const index = carts.findIndex(v => v.goods_id == goods_id);
    // 加减的操作
    if(operation == -1 && carts[index].num - 1 === 0){
      //执行确认操作,这里代表商品数量执行减号之后，变成0
    //使用 微信 wx.showModal 进行用户确认操作 //https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
      const res = await showModal({
        content:"您确定要删除商品？"
      });
      //确认要删除该商品
      if (res.confirm){
        carts.splice(index,1)
      }

    }else{
      carts[index].num += operation;
    }
    this.setCart(carts);
  },
  // 购物车列表的全选事件
  handleAllChecked:function(e){
    //从this.data里面获取 allChecked 还有 购物车数据列表 carts
    let { allChecked ,carts } = this.data;
    // 点击全选 对 allChecked 状态取反
    allChecked = !allChecked;
    //对购物车里面的carts属性进行循环 v.checked = allChecked
    // forEach 用法 与map区别 map 会返回循环之后的数组 forEach不会
    carts.forEach(v => v.checked = allChecked );
    this.setCart(carts);

  },

  // 购物车列表的选中事件
  handleCheck:function(e){
    // 1. 获取当前点击列表的goods_id
    const { goods_id } = e.currentTarget.dataset;
    console.log(goods_id);
    //2. 从storage里面获取当前购物小车的列表 carts
    const carts = wx.getStorageSync("carts")||[];
    //3. 对购物小车里面的carts 进行循环 找到 goods_id对应的item
    //index 就是对应item 的下标
    const index = carts.findIndex(v => v.goods_id === goods_id);
    // 对选中元素的checked属性 取反
    carts[index].checked = !carts[index].checked;
    //把最新的carts 设置回 this.data 和 storage里面
    this.setCart(carts);
  },
// setCart的作用 就是用来计算购物小车需要的总价和数量,以及
//全选状态 allChecked
//把全新的 carts 重新设置回 storage 保持 storage里面的carts 与 this.data里面的carts 同步
// allChecked 的处理逻辑
//1. allChecked 如果购物车里面的购物车数据 v.checked 属性都为true => allChecked = true
//2. 其它情况下 allChecked = false
  setCart:function(carts){
    let allChecked = true;//默认情况下 全选

    //商品总数
    let totalNum = 0;
    //选中 商品的总价
    let totalPrice = 0;
    //循环购物小车
    carts.forEach(v => {
      if(v.checked){
        // allChecked 不用修改
        // 计算商品总数
        totalNum += v.num; // totalNum = totalNum + v.num;
        //计算商品总价
        totalPrice += v.num * v.goods_price
      }else{
        //只要其中一个不为真，allChecked就为false
        allChecked = false;
      }
    })

    console.log(carts);
      //把数据存到data中 视图就会更新
    this.setData({
      carts,allChecked,totalNum,totalPrice
    });
    //把全新的 carts 重新设置回 storage 保持 storage里面的carts 与 this.data里面的carts 同步
    wx.setStorageSync("carts", carts);
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