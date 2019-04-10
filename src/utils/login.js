/**
 * 判断是否已经在微信登陆
 * @returns {*}
 */
export function isLogin() {
  const userInfo = wx.getStorageSync('userInfo')
  if (userInfo) {
    return userInfo;
  }
}

/**
 * 调用微信登录
 */
export function login () {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录远程服务器
          // console.log('微信登陆成功', res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信获取用户信息接口，需要button授权
 */
export function getUserInfo () {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log('获取用户信息成功', res)
              resolve(res);
            },
            fail: function (err) {
              console.log('获取用户信息失败', err)
              reject(err);
            }
          })
        } else { // 没有授权
          console.log('但获取用户信息失败，未同意button授权')
        }
      }
    })
  });
}
/**
 * 检查微信会话是否过期
 */
function checkWxSession () {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
export function checkSession () {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      checkWxSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })
}

