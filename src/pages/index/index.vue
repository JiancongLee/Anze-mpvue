<template>
  <div class="index">
    <div class="search">
      <div @click="toMappage">{{cityName}}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品">
        <span class="icon"></span>
      </div>
    </div>
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item, index) in banner " :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.image_url" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!--类型-->
    <div class="channel">
      <div @click="categoryList(item.id)" v-for="(item, index) in channel" :key="index">
        <!--<img :src="'http://localhost:8088/fast/api/viewImage?id='+item.iconUrl" alt="">-->
        <!--<img v-bind:src="showImage(item.iconUrl)" alt="">-->
        <img :src="baseUrl+item.iconUrl" alt="">
        <!--<img v-bind:src="getData" alt="">-->
        <!--<img :src="'http://localhost:8088/fast/api/viewImage?id=1115460858487504898'" alt="">-->
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="brand">
      <div @click="tobrandList" class="head">
        品牌制造商直供
      </div>
      <div class="content">
        <div @click="branddetail(item.id)" v-for="(item, index) in brandList" :key="index">
          <div>
            <p>{{item.name}}</p>
            <!--<p>{{item.floor_price}}元起</p>-->
          </div>
          <img :src="baseUrl+item.picUrl" alt="">
          <!--<img :src="item.new_pic_url" alt="">-->
        </div>
      </div>
    </div>
    <div class="newgoods">
      <div @click="goodsList('new')" class="newgoods-top">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="goodsDetail(item.id)" v-for="(item, index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="newgoods hotgoods">
      <div @click="goodsList('hot')" class="newgoods-top">
        <div class="top">
          <p>人气推荐
            <span></span> 好物精选</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="goodsDetail(item.id)" v-for="(item, index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!--专题-->
    <div class="topicList">
      <div @click="totopic" class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="topicdetail(item.id)" v-for="(item, index) in topicList" :key="index">
              <img :src="item.item_pic_url" alt="">
              <div class="btom">
                <div>
                  <p>{{item.title}}</p>
                  <p>{{item.subtitle}}</p>
                </div>
                <div>
                  {{item.price_info}}元起
                </div>
              </div>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!--先不展示-->
    <div class="newcategory">
      <div class="list" v-for="(item, index) in newCategoryList" :key="index">
        <div class="head">{{item.name}}好物</div>
        <div class="sublist">
          <div @click="goodsDetail(subitem.id)" v-for="(subitem, subindex) in item.goodsList" :key="subindex">
            <img :src="subitem.list_pic_url" alt="">
            <p>{{subitem.name}}</p>
            <p>￥{{subitem.retail_price}}</p>
          </div>
          <div @click="categoryList(item.id)">
            <div class="last">
              <p>{{item.name}}好物</p>
              <span class="icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx"
import { get } from "../../utils"
import { mapState, mapMutations } from "vuex"
import { api } from "../../utils/api"
export default {
  onShow() {
  },
  computed: {
    ...mapState(["cityName"]),
    baseUrl: function() {
      return `http://localhost:8088/fast/api/viewImage?id=`
    }
  },
  mounted() {
    this.getCityName()
    this.getData()
    this.getA()
    this.getB()
  },
  data() {
    return {
      banner: [],
      channel: [],
      brandList: [],
      newGoods: [],
      hotGoods: [],
      topicList: [],
      newCategoryList: []
    }
  },
  components: {},
  methods: {
    ...mapMutations(["update"]),
    toMappage() {
      let _this = this;
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
      wx.getSetting({
        success(res) {
          //如果没有同意授权,打开设置
          if (!res.authSetting["scope.userLocation"]) {
            wx.openSetting({
              success: res => {
                _this.getCityName();
              }
            });
          } else {
            wx.navigateTo({
              url: "/pages/mappage/main"
            });
          }
        }
      });
    },
    // 获取地址名称
    getCityName() {
      let _this = this;
      // 这里的key是高德地图的key
      let myAmapFun = new amapFile.AMapWX({
        key: "97faa54917fe130b2693909070a45945"
      })
      myAmapFun.getRegeo({
        success: function (data) {
          //成功回调
          _this.update({ cityName: data[0].regeocodeData.formatted_address });
        },
        fail: function (info) {
          //失败回调
          console.log(info);
          //如果用户拒绝授权
          // 默认为东莞
          _this.cityName = "东莞市";
          _this.update({ cityName: "东莞市" });
        }
      });
    },
    // 跳转到搜索页面
    toSearch() {
      wx.navigateTo({
        url: '/pages/search/main'
      });
    },
    getA () {
      this.$fly.request({
        method: 'get',
        url: '/api/category/list',
        body: {
          level: 0
        }
      }).then(res =>{
        if (res.code === 0) {
          this.channel = res.list
        }
      })
    },
    async getData() {
      const data = await get("/index/index");
      this.banner = data.banner;
      // this.channel = data.channel
      // this.brandList = data.brandList;
      this.newGoods = data.newGoods;
      this.hotGoods = data.hotGoods;
      this.topicList = data.topicList;
      this.newCategoryList = data.newCategoryList;
    },
    /**
     * 跳转到获取详情页面
     * @param id
     */
    goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id
      });
    },
    /**
     * 跳转到商品分类列表
     * @param id
     */
    categoryList(id) {
      wx.navigateTo({
        url: "/pages/categorylist/main?id=" + id
      });
    },
    goodsList(info) {
      if (info == "hot") {
        wx.navigateTo({
          url: "/pages/newgoods/main?isHot=" + 1
        });
      } else {
        wx.navigateTo({
          url: "/pages/newgoods/main?isNew=" + 1
        });
      }
    },
    topicdetail(id) {
      wx.navigateTo({
        url: "/pages/topicdetail/main?id=" + id
      });
    },
    totopic() {
      wx.navigateTo({
        url: "/pages/topic/main"
      });
    },
    tobrandList() {
      wx.navigateTo({
        url: "/pages/brandlist/main"
      });
    },
    branddetail(id) {
      wx.navigateTo({
        url: "/pages/branddetail/main?id=" + id
      });
    },
    reversedMessage (id) {
      let url = api.viewPicture + '?id='+id
      return url
    },
    showImage (id) {
      return `http://localhost:8088/fast/api/viewImage?id=`+id
    },
    getB () {
      this.$fly.request({
        method: 'get',
        url: '/api/brand/list'
      }).then(res =>{
        if (res.code === 0) {
          this.brandList = res.list
        }
      })
    }
  },
  created() { },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/index/index'
    }
  }
}
</script>

<style lang='scss' scoped>
@import "./style.scss";
</style>
