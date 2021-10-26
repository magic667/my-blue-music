<template>
  <div id="aside">
    <!-- 主路由导航 -->
    <el-menu router :default-active="defaultActive">
      <el-menu-item
        v-for="(item, index) in subnavitem"
        :key="index"
        :index="item.path"
      >
        <span class="iconfont" :class="item.icon"></span>
        <span>{{ item.name }}</span>
      </el-menu-item>
      <!-- 登录后 -->
      <div class="mycreate" v-if="userSongList != 0">
        <p class="by">我创建的歌单</p>
        <el-menu-item
          v-for="item in createSongList"
          :key="item.id"
          :index="'/songlistdetail/' + item.id"
        >
          <span class="iconfont icon-xihuan"></span>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </div>
      <div class="collect" v-if="userSongList != 0">
        <p class="by">我收藏的歌单</p>
        <div class="person">
          <el-menu-item
            v-for="item in collectSongList"
            :key="item.id"
            :index="'/songlistdetail/' + item.id"
          >
            <span class="iconfont icon-gedan"></span>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Aside",
  data() {
    return {
      defaultActive: "",
      subnavitem: [
        { name: "发现音乐", path: "/findmusic", icon: "icon-yinyueclick" },
        { name: "推荐视频", path: "/recvideo", icon: "icon-shipin1" },
        { name: "每日推荐", path: "/receveryday", icon: "icon-dianzan" },
        { name: "我的收藏", path: "/myfavorite", icon: "icon-myfavorite" },
      ],
      collectIndex: null,
    };
  },
  watch: {
    // 监听路由路径变化
    "$route.path"(newVal, oldVal) {
      this.defaultActive = "/" + newVal.split("/")[1];
    },
  },
  computed: {
    ...mapGetters(["userSongList", "userInfo"]),
    createSongList() {
      // 用户收藏的第一个歌单的索引号
      this.collectIndex = this.userSongList.findIndex((item) => {
        return item.creator.userId != this.userInfo.userId;
      });
      // 截取用户创建的歌单
      return this.userSongList.slice(0, this.collectIndex);
    },
    collectSongList() {
      return this.userSongList.slice(this.collectIndex);
    },
  },
};
</script>

<style lang="less" scoped>
#aside {
  overflow-y: scroll;
  width: 230px;
  height: 100%;
  padding-top: 2px;
  border-right: 1px solid #dddddd;

  .el-menu {
    border-right: 0;
  }

  .el-menu-item {
    height: 53px;
    line-height: 53px;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .el-menu-item.is-active {
    font-weight: 700;
    color: #5292fe;
  }

  span {
    padding-right: 10px;
  }

  .by {
    padding-left: 10px;
    font-size: 14px;
  }

  .person {
    margin-top: 10px;
  }
}
</style>