<template>
  <div id="footer">
    <div class="player">
      <!-- 音频标签 -->
      <audio
        :src="songUrl"
        ref="audioplay"
        autoplay
        @play="changeState(true)"
        @pause="changeState(false)"
        @loadedmetadata="onLoadedmetadata"
        @timeupdate="onTimeupdate"
        @ended="getNextSong"
      ></audio>
      <!-- 左侧歌曲信息 -->
      <div class="left-cover-content">
        <!-- 有音乐时 -->
        <div
          class="cover-content"
          v-if="Object.keys(nowSongDetail).length !== 0"
        >
          <div class="cover" @click="showSongDetail">
            <img :src="nowSongDetail.al.picUrl" alt="" />
          </div>
          <div class="songname">
            <p style="padding-bottom: 5px">{{ nowSongDetail.name }}</p>
            <p class="by">{{ nowSongDetail.ar[0].name }}</p>
          </div>
          <!-- 喜欢按钮 -->
          <div class="like-song" @click="isLikeNowSong">
            <span>
              <i class="iconfont icon-like" :class="{ like: islike }"></i>
            </span>
          </div>
        </div>
        <!-- 没有音乐时 -->
        <div
          class="cover-content"
          v-if="Object.keys(nowSongDetail).length == 0"
          @click="showSongDetail"
        >
          <div class="cover">
            <img
              src="../assets/imgs/music-icon.png"
              style="width: 130%"
              alt=""
            />
          </div>
          <div class="songname">暂无音乐</div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="change-play">
        <!-- 上一首 -->
        <span class="change-box" @click="getBackSong">
          <i class="iconfont icon-shangyiqu"></i>
        </span>
        <!-- 播放，暂停 -->
        <span class="play-box" v-if="!isPlaying" @click="playMusic">
          <i class="iconfont icon-play"></i>
        </span>
        <span class="play-box" v-else @click="pauseMusic">
          <i class="iconfont icon-pause"></i>
        </span>
        <span class="change-box" @click="getNextSong">
          <i class="iconfont icon-xiayiqu"></i>
        </span>
      </div>
      <!-- 歌曲进度条 -->
      <div class="song-progress">
        <!-- 当前歌曲时间 -->
        <span v-if="playingList.length == 0">00:00</span>
        <span v-if="Object.keys(nowSongDetail).length !== 0">
          {{ currentTime }}
        </span>
        <!-- 进度条 -->
        <div class="s-progress">
          <el-slider
            v-model="songProgress"
            :format-tooltip="formatTooltip"
            :disabled="playingList.length == 0"
            @change="changeSongProgress"
          ></el-slider>
        </div>
        <span v-if="playingList.length == 0">00:00</span>
        <span v-if="Object.keys(nowSongDetail).length !== 0">
          {{ totalTime }}
        </span>
      </div>
      <!-- 播放模式 -->
      <div class="play-model">
        <span v-if="playModel == 1" @click="changePlayModel(2)">
          <i class="iconfont icon-orderplay"></i>
        </span>
        <span v-if="playModel == 2" @click="changePlayModel(3)">
          <i class="iconfont icon-random"></i>
        </span>
        <span v-if="playModel == 3" @click="changePlayModel(1)">
          <i class="iconfont icon-danqu"></i>
        </span>
        <span>
          <i class="iconfont icon-cibiaoquanyi" @click="showSongDetail"></i>
        </span>
      </div>
      <!-- 右侧音量条 -->
      <div class="right-voice">
        <!-- 静音按钮 -->
        <span>
          <i
            class="iconfont icon-jingyin"
            @click="cancelMute"
            v-if="voiceProgress == 0"
          ></i>
          <i class="iconfont icon-laba" @click="muteVolume" v-else></i>
        </span>
        <!-- 音量条 -->
        <div class="v-progress">
          <el-slider
            v-model="voiceProgress"
            @change="changeVoiceProgress"
          ></el-slider>
        </div>
        <!-- 播放列表按钮 -->
        <el-tooltip effect="dark" content="播放列表" placement="top">
          <span @click="showPlayingList">
            <i class="iconfont icon-songplaylist"></i>
          </span>
        </el-tooltip>
      </div>
      <!-- 当前播放列表 -->
      <transition name="playlist">
        <PlayingList v-show="isShowDrawer"></PlayingList>
      </transition>
    </div>
  </div>
</template>

<script>
import {
  getSongUrl,
  likeNowSong,
  getLikeSongList,
} from "network/playmusic/playmusic.js";
import { mapGetters } from "vuex";
import { formatDuration } from "../common/formatDuration";
import { getRandom } from "common/getRandom";
import PlayingList from "components/content/player/PlayingList.vue";

export default {
  name: "Footer",
  components: { PlayingList },
  data() {
    return {
      isShowDrawer: false, // 是否显示播放列表
      totalSecond: "", // 歌曲总秒数
      currentSecond: "", // 歌曲当前秒数
      totalTime: "", // 歌曲总时长(分钟)
      currentTime: "", // 歌曲当前处于分钟数
      songProgress: null, // 歌曲时间进度条
      voiceProgress: 50, // 音量进度条
      nowVolume: "", // 静音前的音量
      islike: false, // 是否喜欢当前播放歌曲
    };
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "songUrl",
      "isPlaying",
      "playingList",
      "nowSongDetail",
      "playModel",
    ]),
  },
  methods: {
    // 显示播放列表
    showPlayingList() {
      this.isShowDrawer = !this.isShowDrawer;
    },
    // 显示当前歌曲详情页
    showSongDetail() {
      this.$store.commit("showSongDetail");
    },
    // 音频标签事件监听，播放或暂停，提交vuex改变当前播放状态
    changeState(isPlay) {
      this.$store.dispatch("changePlayState", isPlay);
    },
    // 播放，暂停按钮点击事件
    // 播放音乐
    playMusic() {
      if (this.playingList.length == 0) {
        this.$message({
          type: "warning",
          message: "播放列表为空",
          center: true,
        });
      } else {
        this.$refs.audioplay.play();
      }
    },
    // 暂停音乐
    pauseMusic() {
      this.$refs.audioplay.pause();
    },
    // 音频数据加载完成后的事件
    onLoadedmetadata(res) {
      // 获取总秒数
      this.totalSecond = res.target.duration;
      // 格式化为分钟
      this.totalTime = formatDuration(res.target.duration);
    },
    // 监听时间的改变
    onTimeupdate(res) {
      // 当前秒数
      this.currentSecond = res.target.currentTime;
      // 歌曲播放的实时秒数，用于歌词的实时滚动
      this.$store.dispatch("saveCurrentSecond", this.currentSecond);
      // 格式化为分钟
      this.currentTime = formatDuration(res.target.currentTime);
      // 歌曲当前时间改变，进度条一起改变
      this.songProgress = Math.floor(
        (this.currentSecond / this.totalSecond) * 100
      );
    },
    // 拖动时间进度条，改变当前时间
    // len为进度条改变时的回调函数的参数0-100，需要换算成实际时间进度条
    changeSongProgress(len) {
      this.$refs.audioplay.currentTime = Math.floor(
        (len / 100) * this.totalSecond
      );
    },
    // 进度条拖动时，显示当前值
    formatTooltip(val) {
      return formatDuration((val / 100) * this.totalSecond);
    },
    // 声音按钮事件
    // 静音
    muteVolume() {
      //保存当前音量，用于取消静音时恢复音量
      this.nowVolume = this.voiceProgress;
      this.voiceProgress = 0;
      this.$refs.audioplay.volume = 0;
    },
    // 取消静音
    cancelMute() {
      this.voiceProgress = this.nowVolume;
      this.$refs.audioplay.volume = this.voiceProgress / 100;
    },
    // 拖动音量进度条
    changeVoiceProgress(len) {
      this.voiceProgress = len;
      this.$refs.audioplay.volume = this.voiceProgress / 100;
    },
    // 切换歌曲事件
    // 获取当前歌曲索引
    getSongIndex() {
      // 找到当前歌曲在播放列表的索引
      return this.playingList.findIndex(
        (item) => item.id == this.nowSongDetail.id
      );
    },
    // 点击上一首按钮
    getBackSong() {
      // this.$store.commit("changePlayModel", 2);
      if (this.playingList.length == 0) {
        this.$message({
          type: "warning",
          message: "播放列表为空",
          center: true,
        });
        return;
      } else if (this.playingList.length == 1) {
        this.playMusic();
      } else {
        if (this.playModel == 1) {
          this.orderPlayBack();
        } else if (this.playModel == 2) {
          this.randomPlay();
        } else {
          this.loopPlay();
        }
      }
    },
    // 点击下一首按钮
    getNextSong() {
      if (this.playingList.length == 0) {
        this.$message({
          type: "warning",
          message: "播放列表为空",
          center: true,
        });
        return;
      } else if (this.playingList.length == 1) {
        this.playMusic();
      } else {
        if (this.playModel == 1) {
          this.orderPlayNext();
        } else if (this.playModel == 2) {
          this.randomPlay();
        } else {
          this.loopPlay();
        }
      }
    },
    // 播放模式
    // 切换播放模式
    changePlayModel(model) {
      this.$refs.audioplay.loop = false;
      this.$store.commit("changePlayModel", model);
      localStorage.setItem("playModel", model);
    },
    // 1.顺序播放
    // 上一首
    orderPlayBack() {
      let nowIndex = this.getSongIndex();
      let backIndex = null;
      // 如果当前歌曲处于第一首，则上一首为列表最后一首
      if (nowIndex == 0) {
        backIndex = this.playingList.length - 1;
      } else if (nowIndex == -1) {
        // 如果正在播放的歌曲被删除
        backIndex = 0;
      } else {
        backIndex = nowIndex - 1;
      }
      // 根据索引号获取歌曲id，获取歌曲详情
      let backSong = this.playingList[backIndex];
      let backId = backSong.id;
      // 根据id获取url
      getSongUrl(backId).then((res) => {
        // 保存歌曲url
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
        // 保存当前歌曲详情
        this.$store.dispatch("saveSongDetail", backSong);
      });
    },
    // 下一首
    orderPlayNext() {
      let nowIndex = this.getSongIndex();
      let nextIndex = null;
      if (nowIndex == this.playingList.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = nowIndex + 1;
      }
      let nextSong = this.playingList[nextIndex];
      let nextId = nextSong.id;
      getSongUrl(nextId).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
        this.$store.dispatch("saveSongDetail", nextSong);
      });
    },
    // 2.随机播放
    randomPlay() {
      // 获取随机索引号
      let randomIndex = getRandom(0, this.playingList.length - 1);
      // 获取随机歌曲
      let randomSong = this.playingList[randomIndex];
      // 获取随机歌曲的id
      let randomId = randomSong.id;
      getSongUrl(randomId).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
        this.$store.dispatch("saveSongDetail", randomSong);
      });
    },
    // 3.单曲循环
    loopPlay() {
      this.$refs.audioplay.loop = true;
      this.playMusic();
    },
    // 喜欢当前歌曲
    // 判断当前歌曲是否在我喜欢的音乐
    isLikeNowSong() {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: "warning",
          message: "登录后才能收藏",
          showClose: true,
          center: true,
        });
        return;
      }
      let timestamp = Date.parse(new Date());
      getLikeSongList(this.userInfo.userId, timestamp).then((res) => {
        let likeSongIds = [];
        likeSongIds = res.data.ids;
        let index = likeSongIds.findIndex((item) => {
          return item == this.nowSongDetail.id;
        });
        if (index == -1) {
          this.islike = true;
        } else {
          this.islike = false;
        }
        likeNowSong(this.nowSongDetail.id, this.islike).then((res) => {
          if (this.islike == true) {
            this.$message({
              type: "success",
              message: "已添加到我喜欢的音乐",
              center: true,
            });
          } else {
            this.$message({
              type: "warning",
              message: "取消收藏成功",
              center: true,
            });
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 70px;
  background-color: #f8f8ff;
  border-top: 1px solid #dddddd;
  z-index: 1000;
}

.player {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;

  .left-cover-content {
    width: 18%;
    margin-left: 15px;

    .cover-content {
      display: flex;
      align-items: center;

      .cover {
        width: 60px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .songname {
        margin-left: 10px;

        p {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .like-song {
        margin-left: 20px;

        .icon-like {
          font-size: 18px;
          font-weight: 700;
        }

        .like {
          color: #409eff;
        }
      }
    }
  }

  .change-play {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12%;

    .change-box,
    .play-box {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background: rgba(64, 158, 255, 0.8);
      border-radius: 50%;
      &:hover {
        background: #409eff;
      }
    }

    .change-box {
      width: 30px;
      height: 30px;
      margin: 0 10px;
    }

    .play-box {
      width: 42px;
      height: 42px;
      padding-left: 2px;
    }

    .icon-shangyiqu,
    .icon-xiayiqu {
      font-size: 18px;
    }

    .icon-play,
    .icon-pause {
      font-size: 22px;
    }
  }

  .song-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;

    span {
      padding: 0 10px;
    }

    .s-progress {
      width: 85%;
    }
  }

  .play-model {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 25px;
      margin: 0 5px;

      &:hover {
        color: #409eff;
      }
    }

    .icon-orderplay,
    .icon-random {
      font-size: 18px;
      font-weight: 700;
    }

    .icon-danqu,
    .icon-cibiaoquanyi {
      font-weight: 700;
    }
  }

  .right-voice {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;

    span {
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }

    .icon-laba,
    .icon-jingyin {
      font-size: 20px;
      font-weight: 700;
    }

    .icon-songplaylist {
      font-size: 18px;
    }

    .v-progress {
      width: 40%;
    }
  }

  span {
    cursor: pointer;
  }
}

// 播放列表动画
.playlist-enter,
.playlist-leave-to {
  transform: translateX(100%);
}

.playlist-enter-active,
.playlist-leave-active {
  transition: all 0.6s;
}

.playlist-enter-to {
  transform: translateX(0);
}
</style>