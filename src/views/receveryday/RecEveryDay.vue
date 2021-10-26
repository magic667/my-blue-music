<template>
  <div class="rec-everyday w">
    <div class="logined" v-if="$store.state.isLogin">
      <div class="hd">
        <div class="nowdata">
          <div class="left-date">
            <p>{{ getNowDay }}</p>
            <div class="nowday">{{ getNowDate }}</div>
          </div>
          <div class="right-text">
            <h2>每日歌曲推荐</h2>
            <p>根据你的音乐口味生成，每天6:00更新</p>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" icon="el-icon-video-play" @click="playAll"
            >播放全部</el-button
          >
          <el-button icon="el-icon-folder-add">收藏全部</el-button>
        </div>
      </div>
      <div class="bd">
        <SongTable :songs="recsongs"></SongTable>
      </div>
    </div>
    <div class="nologin" v-else>
      <el-empty description="登录后才能查看" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getRecSongs } from "network/receveryday/receveryday";
import { getSongUrl } from "network/playmusic/playmusic.js";
import SongTable from "components/content/SongTable.vue";

export default {
  name: "RecEveryDay",
  components: { SongTable },
  data() {
    return {
      recsongs: [],
    };
  },
  computed: {
    getNowDate() {
      let date = new Date();
      // 返回的是日期几号
      let dates = date.getDate();
      return dates;
    },
    getNowDay() {
      let date = new Date();
      // 返回 0~6，其中0为星期日
      let day = date.getDay();
      // 通过返回数字作为索引号，取出对应的是星期几
      let arr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      return arr[day];
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
    }
    // 获取每日推荐歌曲
    getRecSongs().then((res) => {
      this.recsongs = res.data.data.dailySongs;
    });
  },
  methods: {
    playAll() {
      this.$store.dispatch("addAllSong", this.recsongs);
      // 默认播放第一首歌
      getSongUrl(this.recsongs[0].id).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
      });
      // 保存当前歌曲详情
      this.$store.dispatch("saveSongDetail", this.recsongs[0]);
    },
  },
};
</script>

<style lang="less" scoped>
.nowdata {
  display: flex;

  .left-date {
    width: 100px;
    height: 100px;
    text-align: center;
    border: 1px solid rgb(233, 233, 233);

    p {
      padding: 3px 0;
      font-size: 16px;
    }

    .nowday {
      font-size: 52px;
      color: #409eff;
    }
  }

  .right-text {
    padding-left: 20px;

    h2 {
      padding-bottom: 20px;
    }
  }
}

.btn {
  margin: 20px 0;
}
</style>