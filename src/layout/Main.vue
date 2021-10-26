<template>
  <div id="main">
    <!-- 侧边导航 -->
    <div class="aside">
      <Aside></Aside>
    </div>
    <!-- 主路由视图 -->
    <div class="view">
      <keep-alive
        exclude="Songlistdetail,VideoDetail,Singerdetail,Albumdetail,Searchdetail,UserDetail,Follows,FansList,PlayingSongDetail,MyFavorite"
      >
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
      <!-- 返回顶部按钮 -->
      <el-backtop
        target=".view"
        :right="30"
        :bottom="75"
        id="backtop"
      ></el-backtop>
    </div>
    <!-- 当前歌曲详情页 -->
    <transition name="songdetail">
      <PlayingSongDetail v-show="isShowSongDetail"></PlayingSongDetail>
    </transition>
  </div>
</template>

<script>
import Aside from "./Aside.vue";
import PlayingSongDetail from "components/content/player/PlayingSongDetail.vue";
import { mapGetters } from "vuex";

export default {
  name: "Main",
  components: {
    Aside,
    PlayingSongDetail,
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  computed: {
    ...mapGetters(["nowSongDetail", "isShowSongDetail"]),
  },
  // 提供给视频详情页，局部刷新功能
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    // 实现页面的局部刷新
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="less" scoped>
#main {
  display: flex;
  height: calc(100% - 130px);
}

.view {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}

#backtop {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(100, 149, 237, 0.5);
}
// 歌曲详情页动画
.songdetail-enter,
.songdetail-leave-to {
  transform: translateY(calc(100vh - 70px));
}

.songdetail-enter-active,
.songdetail-leave-active {
  transition: all 0.5s;
}

.songdetail-enter-to {
  transform: translateY(0);
}
</style>