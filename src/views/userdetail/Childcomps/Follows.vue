<template>
  <div class="follows w">
    <el-divider content-position="left">
      <h2>{{ $route.params.uname }}关注的人</h2>
    </el-divider>
    <div style="width: 100%; text-align: center" v-if="follows.length == 0">
      还没有关注其他人
    </div>
    <UserList :userlist="follows"></UserList>
    <!-- 分页器 -->
    <div class="page">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="48"
        layout="total, prev, pager, next"
        :total="1 * $route.params.follows"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserFollows } from "network/userdetail/userdetail";
import UserList from "components/content/userlist/UserList.vue";

export default {
  name: "Follows",
  components: { UserList },
  data() {
    return {
      uid: null,
      follows: [],
    };
  },
  created() {
    this.uid = this.$route.params.uid;
    this.getUserFollowsBy();
  },
  methods: {
    // 获取当前uid的关注列表
    getUserFollowsBy(page = 1) {
      let limit = 48;
      let offset = (page - 1) * limit;
      let timestamp = Date.parse(new Date());
      getUserFollows(this.uid, offset, limit, timestamp).then((res) => {
        this.follows = res.data.follow;
        // 判断是否为当前登录用户的关注列表，只保存当前登录用户的关注列表
        if (this.$store.state.userInfo.userId == this.uid) {
          this.$store.dispatch("saveUserFollowsList", res.data.follow);
        }
      });
    },
    // 分页事件
    handleCurrentChange(page) {
      this.getUserFollowsBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style>
</style>