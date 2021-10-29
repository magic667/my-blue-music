<template>
  <div class="playing-song-detail">
    <!-- 返回顶部按钮 -->
    <el-backtop
      target=".playing-song-detail"
      :right="20"
      :bottom="75"
      class="backtop"
    ></el-backtop>
    <!-- 关闭按钮 -->
    <span class="iconfont icon-down-arrow" @click="closeSongDetail"></span>
    <!-- 主要内容 -->
    <div class="main-content" v-if="Object.keys(nowSongDetail).length !== 0">
      <!-- 顶部歌词相关内容 -->
      <div class="top-lyrics">
        <!-- 左侧旋转唱片 -->
        <div class="left-cover">
          <!-- 唱片开关旋转 -->
          <div
            class="switchs swichsRotate"
            :class="{ swichsPlay: isPlaying, switchsPause: !isPlaying }"
          >
            <img src="~assets/imgs/cp1.png" alt="" />
          </div>
          <!-- 唱片旋转 -->
          <div class="record record-rotate" :class="{ startRotate: isPlaying }">
            <div class="circle">
              <img src="~assets/imgs/cp2.png" alt="" />
            </div>
            <div class="cover">
              <img :src="nowSongDetail.al.picUrl" alt="" />
            </div>
          </div>
          <img :src="nowSongDetail.al.picUrl" alt="" class="song-bgImg" />
        </div>
        <!-- 右侧歌词 -->
        <div class="right-lyrics">
          <div class="hd">
            <h2>{{ nowSongDetail.name }}</h2>
            <p v-if="nowSongDetail.al.name">
              专辑：<span @click="toAlbum">{{ nowSongDetail.al.name }}</span>
            </p>
            <p>
              歌手：<span @click="toSinger">{{
                nowSongDetail.ar[0].name
              }}</span>
            </p>
          </div>
          <div class="bd">
            <!-- 没有歌词时 -->
            <div style="font-size: 18px" v-if="formatlyric.length == 0">
              暂无歌词，请您欣赏
            </div>
            <!-- 有歌词时 -->
            <div id="scrollLyric" ref="scrollLyric" v-else>
              <div class="plac" style="height: 135px"></div>
              <ul>
                <li
                  v-for="(item, index) in formatlyric"
                  :key="index"
                  :class="{ currentLyric: currentRow == index }"
                >
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部评论 -->
      <div class="bot-content" ref="comment">
        <!-- 评论 -->
        <div class="song-comment">
          <CommentPage
            :comments="comments"
            :hotcomments="hotcomments"
            :comment-count="commentCount"
            :comment-type="0"
            :commentres-id="nowSongDetail.id"
            @updateComment="getSongCommentBy"
            @changePage="changePage"
            @toUserDetail="toUserDetail"
          />
        </div>
      </div>
    </div>
    <div class="nosongdetail" v-if="Object.keys(nowSongDetail).length == 0">
      <p>暂无音乐</p>
    </div>
  </div>
</template>

<script>
import { getNowLyric, getSongComment } from "network/playmusic/playmusic";
import { mapGetters } from "vuex";
import CommentPage from "components/content/comment/CommentPage.vue";

export default {
  name: "PlayingSongDetail",
  components: { CommentPage },
  computed: {
    ...mapGetters(["isPlaying", "nowSongDetail", "currentSecond"]),
  },
  data() {
    return {
      lyric: "",
      formatlyric: [], // 格式化后的歌词
      currentRow: "", // 当前播放的歌词行数
      hotcomments: [], // 热门评论
      comments: [], // 评论
      commentCount: null, // 评论总数
    };
  },
  created() {
    if (Object.keys(this.nowSongDetail).length !== 0) {
      this.getNowLyricBy(this.nowSongDetail.id);
      this.getSongCommentBy();
    }
  },
  methods: {
    // 关闭歌曲详情页
    closeSongDetail() {
      this.$store.commit("showSongDetail");
    },
    //   获取歌词
    getNowLyricBy(songId) {
      getNowLyric(songId).then((res) => {
        if (res.data.nolyric || !res.data.lrc) {
          return;
        }
        this.lyric = res.data.lrc.lyric;
        this.formatLyric(this.lyric);
      });
    },
    // 格式化歌词
    formatLyric(lyric_str) {
      // 将歌词字符串 根据换行符 转换为 数组
      let lyric_arr = lyric_str.split("\n");
      // 遍历歌词数组
      for (let i = 0; i < lyric_arr.length; i++) {
        //得到每一行歌词
        let lyric_row = lyric_arr[i];
        //再将每一行歌词根据”]“分隔为时间和歌词,变为每行歌词数组
        let lyric_row_arr = lyric_row.split("]");
        // 通过pop()方法得到每行歌词文本
        let lryic_row_text = lyric_row_arr.pop();
        // 处理每行歌词时间
        lyric_row_arr.forEach((item) => {
          let LyricRowObj = {};
          let time_arr = item.substr(1, item.length - 1).split(":"); //去掉"[",并且分离出 分钟和秒
          // 将每行歌词时间转换为秒
          let seconds_row = time_arr[0] * 60 + Math.ceil(time_arr[1]);
          // console.log(seconds_row);
          // 将每行歌词时间和文本添加到每行歌词对象中
          LyricRowObj.time = seconds_row;
          LyricRowObj.text = lryic_row_text;
          //再将每行歌词对象添加到数组中
          this.formatlyric.push(LyricRowObj);
        });
      }
      // 根据时间对歌词排序
      this.formatlyric.sort((a, b) => {
        return a.time - b.time;
      });
    },
    // 获取评论
    getSongCommentBy(page = 1) {
      let offset = (page - 1) * 20;
      // 定义一个时间戳 每次获得最新的评论数据
      let timestamp = Date.parse(new Date());
      getSongComment(this.nowSongDetail.id, offset, timestamp).then((res) => {
        this.hotcomments = res.data.hotComments;
        this.comments = res.data.comments;
        this.commentCount = res.data.total;
      });
    },
    /* 评论分页事件 */
    changePage(page) {
      this.getSongCommentBy(page);
      // 返回指定位置
      let playing = document.querySelector(".playing-song-detail");
      playing.scrollTo({
        behavior: "smooth",
        top: this.$refs.comment.offsetTop,
      });
    },
    // 去往专辑页面
    toAlbum() {
      this.$router.push("/albumdetail/" + this.nowSongDetail.al.id);
      this.closeSongDetail(); //关闭当前歌曲详情页
    },
    // 去往歌手界面
    toSinger() {
      this.$router.push("/singerdetail/" + this.nowSongDetail.ar[0].id);
      this.closeSongDetail(); //关闭当前歌曲详情页
    },
    //去往用户界面 需要关闭当前歌曲详情页
    toUserDetail() {
      this.closeSongDetail();
    },
  },
  watch: {
    // 监听当前时间的变化 通过修改position的top值实现滚动
    currentSecond() {
      // 遍历格式化后的歌词数组
      this.formatlyric.forEach((item, index) => {
        // 如果歌曲当前秒数和歌词数组中的秒数相等
        if (this.currentSecond) {
          if (Math.ceil(this.currentSecond) >= item.time) {
            // let scrollLyric = document.querySelector("#scrollLyric");
            // 修改position的top值实现滚动 设置的每行歌词高度为45px，所以每次移动索引号乘以45px
            this.$refs.scrollLyric.style.top = -index * 45 + "px";
            this.currentRow = index; //用于判断当前歌词高亮显示
          }
        }
      });
    },
    // 监听当前歌曲变化
    nowSongDetail() {
      if (Object.keys(this.nowSongDetail).length !== 0) {
        // 歌曲改变后从新获取歌词和评论
        this.formatlyric = [];
        this.getNowLyricBy(this.nowSongDetail.id);
        this.getSongCommentBy();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.playing-song-detail {
  position: absolute;
  bottom: 70px;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: #fff;
  z-index: 9;
  overflow-y: scroll;

  // 返回顶部按钮
  .backtop {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(100, 149, 237, 0.5);
  }
  // 关闭页面按钮
  .icon-down-arrow {
    position: fixed;
    top: 10px;
    left: 20px;
    font-size: 32px;
    font-weight: 700;
    cursor: pointer;
  }
  // 音乐详情
  .main-content {
    position: relative;
    width: 1350px;
    height: 100%;
    margin: 0 auto;
    .top-lyrics {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70%;
      margin: 0px auto;
      height: 80%;
      // 旋转唱片
      .left-cover {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        .switchs {
          position: absolute;
          left: 50%;
          top: -40%;
          z-index: 2;
          width: 40%;
          transform-origin: 0 0;
          img {
            width: 100%;
            cursor: default;
          }
        }
        .record {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .circle {
            position: absolute;
            left: 0;
            img {
              width: 100%;
              cursor: default;
            }
          }
          .cover {
            width: 80%;
            img {
              width: 100%;
              border-radius: 50%;
            }
          }
        }
        .song-bgImg {
          position: absolute;
          top: 50%;
          left: -90%;
          z-index: -1;
          width: 200%;
          border-radius: 20%;
          transform: translate(10%, -50%);
          filter: blur(350px) brightness(100%);
        }
      }
      // 右侧歌词
      .right-lyrics {
        width: 55%;
        .hd {
          text-align: center;
          p {
            padding-top: 10px;
            span {
              cursor: pointer;
              color: royalblue;
            }
          }
        }
        .bd {
          position: relative;
          margin-top: 20px;
          width: 100%;
          height: 315px;
          text-align: center;
          overflow-y: hidden;
          #scrollLyric {
            position: absolute;
            top: 0px;
            width: 100%;
            transition: all 0.5s;
            li {
              height: 45px;
              line-height: 45px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .currentLyric {
              font-size: 18px;
              font-weight: 700;
            }
          }
        }
      }
    }

    .bot-content {
      margin: 15px auto;
      width: 70%;
      .song-comment {
        padding-bottom: 15px;
      }
    }
  }
  // 暂无音乐
  .nosongdetail {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
  }
}

// 唱片开关旋转动画
.swichsRotate {
  animation-play-state: paused;
}
.swichsPlay {
  animation-name: switchsPlay;
  animation-timing-function: linear;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
.switchsPause {
  animation-name: switchsPause;
  animation-timing-function: linear;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
@keyframes switchsPlay {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(20deg);
  }
}
@keyframes switchsPause {
  0% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(-5deg);
  }
}
// 唱片旋转
.record-rotate {
  animation-name: recordRotate;
  animation-duration: 20s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: paused;
}
.startRotate {
  animation-play-state: running;
}
@keyframes recordRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
