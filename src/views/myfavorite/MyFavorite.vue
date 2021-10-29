<template>
  <div class="my-favourite w">
    <div class="logined" v-if="$store.state.isLogin">
      <!-- 顶部tab栏 -->
      <div class="top-nav">
        <TopNav :tabitem="topnav"></TopNav>
      </div>
      <!-- 收藏内容 -->
      <div class="favorite-content">
        <router-view></router-view>
      </div>
    </div>
    <div class="nologin" v-else>
      <el-empty description="登录后才能查看" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import TopNav from "components/common/TopNav.vue";

export default {
  name: "MyFavorite",
  components: { TopNav },
  data() {
    return {
      topnav: [
        { path: "/myfavorite/album", name: "专辑" },
        { path: "/myfavorite/singer", name: "歌手" },
        { path: "/myfavorite/mv", name: "MV" },
      ],
    };
  },
  creted() {
    if (!this.$store.state.isLogin) {
      this.$message({
        type: "waring",
        message: "登录后才能查看",
        showClose: true,
        center: true,
      });
    }
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