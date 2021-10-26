<template>
  <div id="user-detail" class="w">
    <div class="logined" v-if="$store.state.isLogin">
      <!-- 顶部基本信息 -->
      <div class="top-userinfo">
        <div class="left-avatar">
          <img :src="currentUserInfo.avatarUrl" alt="" />
        </div>
        <div class="right-info">
          <!-- 第一栏 -->
          <div class="row1">
            <div class="uname">
              <h2>{{ currentUserInfo.nickname }}</h2>
              <div class="gender">
                <span
                  class="iconfont icon-nan"
                  v-if="currentUserInfo.gender == 1"
                ></span>
                <span
                  class="iconfont icon-nv"
                  v-else-if="currentUserInfo.gender == 2"
                ></span>
              </div>
              <el-tag size="small">Lv：{{ currentUserInfo.level }}</el-tag>
            </div>
            <!-- 关注按钮 -->
            <el-button
              size="small"
              v-if="uid != $store.state.userInfo.userId"
              class="subuser"
              :icon="isSub ? 'el-icon-check' : 'el-icon-plus'"
              :type="isSub ? 'primary' : ''"
              @click="subUserBy"
              >{{ isSub ? "已关注" : "关注" }}</el-button
            >
          </div>
          <!-- 歌手身份 -->
          <div class="singer" v-if="currentUserInfo.identify">
            <span>
              <img :src="currentUserInfo.identify.imageUrl" alt=""
            /></span>
            <i>{{ currentUserInfo.identify.imageDesc }}</i>
          </div>
          <!-- 用户信息 -->
          <div class="data-info">
            <div class="data-num">
              <div class="num-item" style="padding-left: 0">
                <h2>{{ currentUserInfo.eventCount }}</h2>
                <p>动态</p>
              </div>
              <div
                class="num-item"
                style="borde-right: 1px solid #ddd; border-left: 1px solid #ddd"
                @click="toFollows"
              >
                <h2>{{ currentUserInfo.follows }}</h2>
                <p>关注</p>
              </div>
              <div class="num-item" @click="toFansList">
                <h2>{{ currentUserInfo.followeds | formatNum }}</h2>
                <p>粉丝</p>
              </div>
            </div>
            <div class="base-info">
              <p>
                用户ID：<span>{{ uid }}</span>
              </p>
              <p>
                个人介绍：<span>{{
                  currentUserInfo.signature == ""
                    ? "暂无介绍"
                    : currentUserInfo.signature
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部歌单 -->
      <div class="mycreate" v-if="createdSongList.length !== 0">
        <el-divider content-position="left">
          <h2>
            <span>{{ currentUserInfo.nickname }}</span> 创建的歌单({{
              createdSongList.length
            }})
          </h2>
        </el-divider>
        <SongList :song-list="createdSongList"></SongList>
      </div>
      <div class="mycollect" v-if="collectSongList.length !== 0">
        <el-divider content-position="left">
          <h2>
            <span>{{ currentUserInfo.nickname }}</span> 收藏的歌单({{
              collectSongList.length
            }})
          </h2>
        </el-divider>
        <SongList :song-list="collectSongList"></SongList>
      </div>
    </div>
    <div class="nologin">
      <el-empty
        v-if="!$store.state.isLogin"
        description="登录后才能查看"
        :image-size="200"
      ></el-empty>
    </div>
  </div>
</template>

<script>
import {
  getUserDetail,
  getUserSonglist,
  getUserFollows,
  subUser,
} from "network/userdetail/userdetail";
import { mapGetters } from "vuex";
import SongList from "components/content/songlist/SongList.vue";

export default {
  inject: ["reload"],
  name: "UserDetail",
  components: { SongList },
  data() {
    return {
      uid: null,
      currentUserInfo: {},
      userSongList: [],
      collectSongList: [], // 收藏的歌单
      createdSongList: [], // 创建的歌单
      isSub: false, // 是否关注了当前用户
    };
  },
  computed: {
    ...mapGetters(["userFollowList", "userInfo"]),
  },
  watch: {
    // 页面局部刷新
    $route(to, from) {
      if (to !== from) {
        this.reload();
      }
    },
  },
  created() {
    if (!this.$store.state.isLogin) {
      this.$message({
        type: "warning",
        message: "登录后才能查看",
        showClose: true,
        center: true,
      });
      return;
    }
    this.uid = this.$route.params.uid;
    this.getUserDetailBy();
    this.getUserSonglistBy();
    // 获取用户的关注列表
    if (this.userFollowList.length == 0) {
      this.getLoginUserFollows();
    }
    // 判断是否关注了当前用户
    this.isSubUser();
  },
  methods: {
    // 获取用户信息
    getUserDetailBy() {
      let timestamp = Date.parse(new Date());
      getUserDetail(this.uid, timestamp).then((res) => {
        res.data.profile.level = res.data.level;
        // 如果是歌手，添加歌手身份
        if (res.data.identify) {
          res.data.profile.identify = res.data.identify;
          this.currentUserInfo = res.data.profile;
        } else {
          this.currentUserInfo = res.data.profile;
        }
      });
    },
    // 获取用户歌单
    getUserSonglistBy() {
      let timestamp = Date.parse(new Date());
      getUserSonglist(this.uid, timestamp).then((res) => {
        this.userSongList = res.data.playlist;
        // 查找用户收藏的第一个歌单的索引号
        let collectIndex = this.userSongList.findIndex((item) => {
          return item.creator.userId != this.uid;
        });
        // 截取用户创建的歌单
        this.createdSongList = this.userSongList.slice(0, collectIndex);
        // 截取用户收藏的歌单
        this.collectSongList = this.userSongList.slice(collectIndex);
      });
    },
    // 事件监听
    // 点击关注。跳转关注列表
    toFollows() {
      this.$router.push({
        name: "Follows",
        params: {
          uid: this.uid,
          uname: this.currentUserInfo.nickname,
          follows: this.currentUserInfo.follows,
        },
      });
    },
    // 点击粉丝，跳转粉丝列表
    toFansList() {
      this.$router.push({
        name: "FansList",
        params: {
          uid: this.uid,
          uname: this.currentUserInfo.nickname,
        },
      });
    },
    // 关注用户事件
    // 获取登录用户的关注列表
    getLoginUserFollows(page = 1) {
      let limit = 1000;
      let offset = (page - 1) * limit;
      let timestamp = Date.parse(new Date());
      getUserFollows(this.userInfo.userId, offset, limit, timestamp).then(
        (res) => {
          // 保存用户登录的关注列表
          this.$store.dispatch("saveUserFollowsList", res.data.follow);
          this.isSubUser();
        }
      );
    },
    // 判断是否关注了当前用户
    isSubUser() {
      let index = this.userFollowList.findIndex((item) => {
        return item.userId == this.uid;
      });
      if (index == -1) {
        this.isSub = false;
      } else {
        this.isSub = true;
      }
    },
    // 点击关注按钮
    subUserBy() {
      // 1为关注，其他为取消关注
      let t = !this.isSub ? 1 : 2;
      subUser(t, this.uid).then((res) => {
        if (res.data.code == 200) {
          // 重新获取登录用户的关注列表
          this.getLoginUserFollows();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.top-userinfo {
  display: flex;

  .left-avatar {
    width: 25vh;

    img {
      width: 100%;
      border-radius: 50%;
      cursor: default;
    }
  }

  .right-info {
    width: 100%;
    padding-left: 3vh;

    .row1 {
      display: flex;
      justify-content: space-between;
    }

    .uname {
      display: flex;
      align-items: center;

      h2 {
        padding-right: 1vh;
      }

      .gender {
        padding-right: 1vh;

        .iconfont {
          font-size: 16px;
        }
      }

      .subuser {
        font-size: 16px;
      }
    }

    .singer {
      display: flex;
      align-items: center;
      margin-top: 5px;

      span {
        display: inline-block;
        width: 24px;
        margin-right: 10px;

        img {
          width: 100%;
        }
      }
    }

    .data-info {
      width: 100%;
      border-top: 1px solid #ddd;
      margin-top: 1vh;

      .data-num {
        display: flex;
        margin-top: 2vh;

        .num-item {
          padding: 0 3vh;
          text-align: center;
          cursor: pointer;
        }
      }

      .base-info {
        margin-top: 1vh;
        span {
          color: #909399;
        }
      }
    }
  }
}

.mycreate,
.mycollect {
  margin-top: 50px;

  span {
    color: #409eff;
  }
}

.sub {
  background-color: #409eff;
  color: #fff;
}
</style>