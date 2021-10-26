<template>
  <div class="fans-list w">
    <el-divider content-position="left">
      <h2>{{ $route.params.uname }}的粉丝</h2>
    </el-divider>
    <div style="width: 100%; text-align: center" v-if="fanslist.length == 0">
      还没有粉丝
    </div>
    <UserList :userlist="fanslist"></UserList>
    <!-- 分页器 -->
    <div class="page" v-if="fanslist.length !== 0 && fansCount > 48">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="48"
        layout="total, prev, pager, next"
        :total="fansCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserFolloweds } from "network/userdetail/userdetail";
import UserList from "components/content/userlist/UserList.vue";

export default {
  name: "FansList",
  components: { UserList },
  data() {
    return {
      fanslist: [],
      fansCount: null,
    };
  },
  created() {
    this.uid = this.$route.params.uid;
    this.getUserFollowedsBy();
  },
  methods: {
    getUserFollowedsBy(page = 1) {
      let offset = (page - 1) * 50;
      getUserFolloweds(this.uid, offset).then((res) => {
        this.fanslist = res.data.followeds;
        this.fansCount = res.data.size;
      });
    },
    // 分页事件
    handleCurrentChange(page) {
      this.getUserFollowedsBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style>
</style>