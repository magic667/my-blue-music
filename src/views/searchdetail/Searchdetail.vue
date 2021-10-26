<template>
  <div id="search-detail" class="w">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <el-menu :default-active="defaultActive" router mode="horizontal">
        <el-menu-item v-for="(item, i) in topnav" :key="i" :index="item.path">
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 主要内容 -->
    <div class="search-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "Searchdetail",
  data() {
    return {
      topnav: [
        {
          name: "单曲",
          path: "/searchdetail/songres/" + this.$route.params.keywords,
        },
        {
          name: "专辑",
          path: "/searchdetail/albumres/" + this.$route.params.keywords,
        },
        {
          name: "歌手",
          path: "/searchdetail/singerres/" + this.$route.params.keywords,
        },
        {
          name: "歌单",
          path: "/searchdetail/songlistres/" + this.$route.params.keywords,
        },
        {
          name: "MV",
          path: "/searchdetail/mvres/" + this.$route.params.keywords,
        },
        {
          name: "视频",
          path: "/searchdetail/videores/" + this.$route.params.keywords,
        },
      ],
      defaultActive: "",
    };
  },
  created() {
    // 通过 “/” ，将路由路径分隔成数组
    let pathArr = this.$route.path.split("/");
    this.defaultActive = `/${pathArr[1]}/${pathArr[2]}/${this.$route.params.keywords}`;
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.reload();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border: 0;
}
.el-menu-item {
  color: #303133;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #5292fe;
  font-size: 18px;
  color: #5292fe;
}
</style>