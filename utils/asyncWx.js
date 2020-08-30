/* 
  使用 promise 对微信的异步操作接口进行封装
 */

/* 
  异步的Modal
  @content 表示在弹出框提示用户的信息
 */
export const showModal = (params) => {
  return new Promise(function(resolve, reject) {
    wx.showModal({
      content: params.content,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/*   
    wx.geSetting()
     promise  封装
 */
export const getSetting = (params) => {
  return new Promise(function(resolve, reject) {
    wx.getSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/* 
打开 openSetting 权限
https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html
 */
export const openSetting = (params) => {
  return new Promise(function (resolve, reject) {
    wx.openSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/* 
   获取用户当前地址
 */
export const chooseAddress = (params) => {
  return new Promise(function (resolve, reject) {
    wx.chooseAddress({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/* 获取登录凭证  */
export const login = (params) => {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/* 
  微信支付的封装 promise
 */
export const requestPayment = (pay) => {
  return new Promise(function (resolve, reject) {
    wx.requestPayment({
      ...pay,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/* showToast 轻提示封装 */
export const showToast = (params) => {
  return new Promise(function (resolve, reject) {
    wx.showToast({
      title: params.title,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}


