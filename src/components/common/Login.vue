<template>
  <div class="login">
    <!-- 未登录头像 -->
    <div class="avatar" v-if="!userInfo" @click="showLogin">
      <div class="block">
        <el-avatar :size="40" :src="circleUrl"></el-avatar>
      </div>
      <div class="uname">{{ uname }}</div>
    </div>
    <!-- 已登录头像 -->
    <div class="avatar" v-else>
      <div @click="toUserDetail">
        <el-avatar :size="40" :src="userInfo.avatarUrl"></el-avatar>
      </div>
      <div class="uname">{{ userInfo.nickname }}</div>
      <div class="logout" @click="Logout" slot="reference">退出</div>
    </div>
    <!-- 登录弹框 -->
    <transition name="el-fade-in">
      <div class="login-pop" v-show="isShowLogin">
        <!-- 关闭按钮 -->
        <div class="close" @click="closeLogin">
          <span class="iconfont icon-guanbi1"></span>
        </div>
        <!-- 图片 -->
        <div class="imgs">
          <img src="~assets/imgs/music-icon.png" alt="" />
        </div>
        <!-- 表单 -->
        <div class="form">
          <el-form label-position="right" label-width="80px">
            <el-form-item label="手机号">
              <el-input
                type="telephone"
                v-model="PhoneNum"
                placeholder="请输入手机号"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="Password"
                placeholder="请输入密码"
                @keyup.enter.native="Login"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Login">登录</el-button>
              <el-button>注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { login, logout } from "network/login/login";
import { getUserSonglist } from "network/userdetail/userdetail";
import { mapGetters } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      uname: "点击头像登录",
      PhoneNum: "",
      Password: "",
      isShowLogin: false,
      userSongList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    showLogin() {
      this.isShowLogin = true;
    },
    closeLogin() {
      this.isShowLogin = false;
    },
    // 登录事件
    Login() {
      // 定义一个时间戳，每次获得最新的数据
      let timestamp = Date.parse(new Date());
      login(this.PhoneNum, this.Password, timestamp).then((res) => {
        if (res.data.code != 200) {
          this.$message({
            message: "手机号或密码错误",
            type: "warning",
            center: true,
          });
        } else {
          this.$message({
            showClose: true,
            message: "登录成功",
            type: "success",
            center: true,
          });
          this.isShowLogin = false;
          // 更新登录状态
          this.$store.dispatch("updateLogin", true);
          localStorage.setItem("isLogin", true);
          // 缓存用户信息，防止刷新消失
          localStorage.setItem("userInfo", JSON.stringify(res.data.profile));
          // 保存用户信息
          this.$store.dispatch("saveUserInfo", res.data.profile);
          // 获取用户歌单数据
          this.getUserSonglistBy(res.data.profile.userId);
        }
      });
    },
    // 获取用户歌单数据
    getUserSonglistBy(uid) {
      let timestamp = Date.parse(new Date());
      getUserSonglist(uid, timestamp).then((res) => {
        this.userSongList = res.data.playlist;
        localStorage.setItem("userSongList", JSON.stringify(res.data.playlist));
        this.$store.dispatch("saveUserSongList", res.data.playlist);
      });
    },
    // 退出登录
    Logout() {
      // 定义一个时间戳，每次获得最新的数据
      let timestamp = Date.parse(new Date());
      logout(timestamp).then((res) => {
        this.$message({
          showClose: true,
          message: "退出成功",
          type: "success",
          center: true,
        });
      });
      // 更新登录状态
      this.$store.dispatch("updateLogin", false);
      localStorage.removeItem("isLogin");
      // 清空用户信息
      this.$store.dispatch("saveUserInfo", null);
      localStorage.removeItem("userInfo");
      // 清空歌单
      this.$store.dispatch("saveUserSongList", []);
      localStorage.removeItem("userSongList");
      // 清空历史播放记录
      this.$store.dispatch("deleteAllHistory");
      localStorage.removeItem("historyPlay");
      // 打开登录框
      this.isShowLogin = true;
      this.PhoneNum = "";
      this.Password = "";
    },
    // 点击登录后的头像
    toUserDetail() {
      this.$router.push("/userdetail/" + this.userInfo.userId);
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  float: right;
  padding-right: 5%;
}

.avatar {
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;

  .uname {
    padding-left: 5px;
  }
}

.logout {
  padding-left: 10px;
  font-size: 16px;
}

.login-pop {
  position: absolute;
  top: 15%;
  right: 40%;
  z-index: 100;
  width: 350px;
  height: 450px;
  box-shadow: 0px 0px 5px 5px #eef;
  background-color: #dcdcdc;
  border-radius: 10px;
  text-align: center;

  .close {
    padding: 10px 20px 0 0;
    text-align: right;
    cursor: pointer;
    .iconfont {
      font-size: 20px;
    }
  }
  .imgs {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    padding-bottom: 20px;

    img {
      width: 100%;
    }
  }

  .form {
    padding-right: 50px;
  }
}
</style>