<template>
  <div class="category">
    <div class="search" @click="tosearch">
      <div class="ser">
        <span class="icon"></span>
        <span>商品搜索</span>
      </div>

    </div>
    <div class="content">
      <scroll-view class="left" scroll-y="true">
        <div class="iconText" @click="getSecondLevelDataList(item.id,index)" v-for="(item, index) in listData" :class="[index === nowIndex?'active':'']" :key="index">
        <!--<div class="iconText" @click="selectitem(item.id,index)" v-for="(item, index) in listData" :class="[index === nowIndex?'active':'']" :key="index">-->
          {{item.name}}
        </div>
      </scroll-view>
      <scroll-view class="right" scroll-y="true">
        <div class="banner">
          <img :src="detailData" alt="">
          <!--<img :src="'http://localhost:8088/fast/api/viewImage?id='+bannerPictureId" alt="">-->
        </div>
        <div class="title">
          <span>—</span>
          <span>{{parentCategoryName}}分类</span>
          <span>—</span>
        </div>
        <div class="bottom">
          <div @click="categoryList(item.id)" v-for="(item,index) in detailData.childrenList" :key="index" class="item">
          <!--<div @click="categoryList(item.id)" v-for="(item,index) in detailData.subList" :key="index" class="item">-->
            <img :src="'http://localhost:8088/fast/api/viewImage?id='+item.iconUrl" alt="">
            <!--<img :src="item.wap_banner_url" alt="">-->
            <span>{{item.name}}</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { get } from "../../utils"
export default {
  created() {},
  mounted() {
    //获取列表数据
    // this.getListData()
    this.getFirstLevelDataList()
    //获取默认右侧数据
    // this.selectitem(this.id, this.nowIndex)
    this.getSecondLevelDataList(this.id, this.nowIndex)
  },

  data() {
    return {
      id: '1105689374504255490',
      // id: "1005000",
      nowIndex: 0,
      listData: [],
      detailData: {},
      parentCategoryName: '',
      bannerPictureId: ''
    }
  },
  components: {},
  methods: {
    tosearch() {
      wx.navigateTo({ url: "/pages/search/main" })
    },
    async selectitem(id, index) {
      this.nowIndex = index;
      const data = await get("/category/currentaction", {
        id: id
      });
      this.detailData = data.data.currentOne
    },
    async getListData() {
      const data = await get("/category/indexaction");
      this.listData = data.categoryList;
    },
    // 获取一级类别
    async getFirstLevelDataList() {
      await this.$fly.request({
        method: 'get',
        url: '/api/category/list',
        body: {
          level: 0
        }
      }).then(res =>{
        if (res.code === 0) {
          this.listData = res.list
        }
      })
    },
    // 获取二级级类别
    getSecondLevelDataList(id, index) {
      this.nowIndex = index
      this.$fly.request({
        method: 'get',
        url: '/api/category/detail',
        body: {
          parentId: id
        }
      }).then(res =>{
        if (res.code === 0) {
          this.detailData = res
          this.parentCategoryName = res.parent.name
          this.bannerPictureId = res.parent.bannerUrl
        }
      })
    },
    categoryList(id) {
      wx.navigateTo({
        url: "../categorylist/main?id=" + id
      })
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
