<template>
  <div id="rec-video">
    <!-- 顶部tab栏 -->
    <div class="top-nav">
      <TopNav :tabitem="topnav" />
    </div>
    <!-- 内容 -->
    <div class="video-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TopNav from "components/common/TopNav.vue";

export default {
  name: "Recvideo",
  components: { TopNav },
  data() {
    return {
      topnav: [
        { path: "/recvideo/mv", name: "MV" },
        { path: "/recvideo/video", name: "视频" },
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
