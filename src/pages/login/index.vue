<template>
  <div class="login">
    <div class="logo">

    </div>
    <button class="login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="doLogin">微信登录</button>
  </div>
</template>

<script>
  import { host } from "../../utils/config"
  import { login, getUserInfo, checkSession } from "../../utils/login"
  import { api } from "../../utils/api"
  let qcloud = require("wafer2-client-sdk/index.js")
  export default {
    created() {},
    mounted() {
      qcloud.setLoginUrl(host + "/api/login")

    },
    data() {
      return {};
    },
    components: {},
    methods: {
      doLogin() {
        wx.showLoading({
          title: "登录中...", //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        })

        let _flag = false
        checkSession().then(res =>{
          console.log('==')
          console.log(res)
          _flag = res
        }).catch((err) => {
          console.log('--')
          _flag = err
        })

        const session = qcloud.Session.get();
        if (_flag) {
          // 第二次登录
          // 或者本地已经有登录态
          // 可使用本函数更新登录态
          qcloud.loginWithCode({
            success: res => {
              // this.setData({ userInfo: res, logged: true });
              wx.setStorageSync("key", "value");
            },
            fail: err => {
              console.error(err);
            }
          });
        } else {
          // 首次登录
          let code = null
          let userInfo = null
          login().then((res) => {
            code = res.code;
            return getUserInfo()
          }).then((result) => {
            userInfo = result
            this.$fly.request({
              method: 'post',
              url: api.loginByWeixin,
              body: {
                code: code,
                avatarUrl: result.userInfo.avatarUrl,
                country: result.userInfo.country,
                province: result.userInfo.province,
                city: result.userInfo.city,
                gender: result.userInfo.gender,
                language: result.userInfo.language,
                nickName: result.userInfo.nickName,
                // userInfo: userInfo
              }
            }).then(res =>{
              if (res.code === 0) {
                // 存储用户信息
                wx.setStorageSync('userInfo', userInfo);
                wx.setStorageSync('token', res.token);
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 2000,
                  success:function(){
                    wx.switchTab({
                      url: '/pages/index/main',
                    })
                  }
                })
              }
            })
          })
        }
      },
      /**
       * 获取用户设备信息
       */
      getSystemInfo () {
        try {
          const res = wx.getSystemInfoSync()
          console.log(res.model)
          console.log(res.pixelRatio)
          console.log(res.windowWidth)
          console.log(res.windowHeight)
          console.log(res.language)
          console.log(res.version)
          console.log(res.platform)
        } catch (e) {
          // Do something when catch error
        }
      },
      toIndexPage() {
        wx.navigateTo({
          url: "/pages/my/main"
        })
      }
    },
    computed: {}
  }

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
