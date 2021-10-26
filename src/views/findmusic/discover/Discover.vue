<template>
  <div id="discover" class="w">
    <!-- 轮播图 -->
    <Banner :banner="banner"></Banner>
    <!-- 推荐歌单 -->
    <Personalized :personalized="personalized" />
    <!-- 推荐MV -->
    <NewMv :newmv="newmv" />
    <!-- 最新音乐 -->
    <RecNewSong :newsong="newsong" />
    <!-- 独家放送 -->
    <Privatecontent :privatecontent="privatecontent" />
  </div>
</template>

<script>
import {
  getBanner,
  getPersonalized,
  getPrivatecontent,
  getNewsong,
  getNewmv,
} from "network/findmusic/discover/discover";
import Banner from "./Childcomps/Banner.vue";
import Personalized from "./Childcomps/Personalized.vue";
import Privatecontent from "./Childcomps/Privatecontent.vue";
import RecNewSong from "./Childcomps/RecNewSong.vue";
import NewMv from "./Childcomps/NewMv.vue";

export default {
  name: "Discover",
  components: { Banner, Personalized, Privatecontent, RecNewSong, NewMv },
  data() {
    return {
      banner: [], // 轮播图数据
      personalized: [], // 推荐歌单
      privatecontent: [], // 独家放送
      newsong: [],
      newmv: [],
    };
  },
  computed: {
    myLogin() {
      return this.$store.state.isLogin;
    },
  },
  watch: {
    myLogin(newval) {
      // 定义一个时间戳 每次获得最新的数据
      let timestamp = Date.parse(new Date());
      getPersonalized(12, timestamp).then((res) => {
        this.personalized = res.data.result;
      });
    },
  },
  created() {
    getBanner().then((res) => {
      this.banner = res.data.banners;
    });
    // 定义一个时间戳，每次获得最新的数据
    let timestamp = Date.parse(new Date());
    getPersonalized(12, timestamp).then((res) => {
      this.personalized = res.data.result;
    });
    getNewsong(15)
      .then((res) => {
        this.newsong = res.data.result;
      })
      .catch((err) => err);
    getPrivatecontent().then((res) => {
      this.privatecontent = res.data.result;
    });
    getNewmv().then((res) => {
      this.newmv = res.data.result;
    });
  },
};
</script>

<style>
</style>