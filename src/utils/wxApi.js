import wx from 'wx'
import api from '@/utils/api'
/**
 * 封封微信的的request
 */
function request (url, data = {}, method = 'GET') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.errno === 401) {
            // 需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              // 登录远程服务器
              request(api.AuthLoginByWeixin, {
                code: code,
                userInfo: userInfo
              }, 'POST').then(res => {
                if (res.errno === 0) {
                  // 存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}
/**
 * 检查微信会话是否过期
 */
function checkSession () {
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
 * 调用微信登录
 */
function login () {
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
function getUserInfo () {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              // console.log('获取用户信息成功', res);
              resolve(res);
            },
            fail: function (err) {
              // console.log('获取用户信息失败', err);
              reject(err);
            }
          })
        } else { // 没有授权
          // console.log('但获取用户信息失败，未同意button授权');
        }
      }
    })
  });
}

const wxApi = {
  request,
  checkSession,
  login,
  getUserInfo
}

export default wxApi
