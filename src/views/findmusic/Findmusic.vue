<template>
  <div id="find-music">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <TopNav :tabitem="topnav"></TopNav>
    </div>
    <!-- 内容 -->
    <div class="music-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopNav from "components/common/TopNav.vue";

export default {
  name: "Findmusic",
  components: { TopNav },
  data() {
    return {
      topnav: [
        {
          name: "个性推荐",
          path: "/findmusic/discover",
        },
        {
          name: "歌单",
          path: "/findmusic/recsonglist",
        },
        {
          name: "排行榜",
          path: "/findmusic/songrank",
        },
        {
          name: "歌手",
          path: "/findmusic/singer",
        },
        {
          name: "最新音乐",
          path: "/findmusic/newsongs",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.top-nav {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>