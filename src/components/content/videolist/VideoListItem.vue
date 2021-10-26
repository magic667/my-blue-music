<template>
  <div class="video-list-item" @click="videoItemClick">
    <!-- 视频封面 -->
    <div class="item-img" @mouseenter="showIcon" @mouseleave="closeIcon">
      <img :src="showImg" />
      <!-- 播放图标遮罩层 -->
      <transition name="el-fade-in-linear">
        <div class="mask-playicon" v-show="isShowPlay">
          <span class="iconfont icon-bofang"></span>
        </div>
      </transition>
      <!-- 播放量 -->
      <transition name="el-zoom-in-top">
        <div class="play-icon" v-show="isShowIcon">
          <span class="iconfont icon-play-square"></span>
          <span v-if="videoListItem.data">{{
            videoListItem.data.playTime ||
            videoListItem.data.playCount | formatNum
          }}</span>
          <span v-else>
            {{ videoListItem.playCount || videoListItem.playTime | formatNum }}
          </span>
        </div>
      </transition>
      <!-- 时长 -->
      <transition>
        <div class="play-duration" v-show="isShowIcon">
          <span v-if="videoListItem.data">{{
            videoListItem.data.durationms ||
            videoListItem.data.duration | formatDuration
          }}</span>
          <span v-else>
            {{
              videoListItem.duration ||
              videoListItem.durationms | formatDuration
            }}
          </span>
        </div>
      </transition>
    </div>
    <!-- 视频介绍 -->
    <div class="item-text">
      <p v-if="videoListItem.data">
        {{ videoListItem.data.title || videoListItem.data.name }}
      </p>
      <p v-else>
        {{ videoListItem.name || videoListItem.title }}
      </p>
      <p class="by">{{ showAuthor }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "videoListItem",
  props: {
    videoListItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isShowIcon: true, // 控制播放量和时长的显示与隐藏
      isShowPlay: false, // 控制播放图标的显示与隐藏
    };
  },
  computed: {
    // 封面
    showImg() {
      return (
        this.videoListItem.cover ||
        this.videoListItem.imgurl16v9 ||
        this.videoListItem.picUrl ||
        this.videoListItem.coverUrl ||
        this.videoListItem.data.coverUrl
      );
    },
    // 作者
    showAuthor() {
      // MV页面
      if (this.videoListItem.id) {
        return this.videoListItem.artistName;
      }
      // 视频页面
      else if (this.videoListItem.data) {
        // 视频中的MV
        if (this.videoListItem.data.artists) {
          return this.videoListItem.data.artists[0].name;
        }
        // 视频
        else {
          return this.videoListItem.data.creator.nickname;
        }
      }
      // 我的收藏视频页面
      else if (this.videoListItem.vid) {
        return this.videoListItem.creator[0].userName;
      }
    },
  },
  methods: {
    showIcon() {
      this.isShowIcon = false;
      this.isShowPlay = true;
    },
    closeIcon() {
      this.isShowIcon = true;
      this.isShowPlay = false;
    },
    // 视频点击事件
    videoItemClick() {
      // 视频页面跳转
      if (this.videoListItem.data) {
        // 视频中的MV
        if (this.videoListItem.data.videoGroup[0].type == 0) {
          this.$router.push({
            name: "VideoDetail",
            params: { id: this.videoListItem.data.id, type: "mv" },
          });
        } else {
          this.$router.push({
            name: "VideoDetail",
            params: { id: this.videoListItem.data.vid, type: "video" },
          });
        }
      }
      // MV页面跳转
      else if (this.videoListItem.id) {
        this.$router.push({
          name: "VideoDetail",
          params: { id: this.videoListItem.id, type: "mv" },
        });
      }
      // 我的收藏视频页面跳转
      else if (this.videoListItem.vid) {
        // MV
        if (this.videoListItem.type == 0) {
          this.$router.push({
            name: "VideoDetail",
            params: { id: this.videoListItem.vid, type: "mv" },
          });
        } else {
          this.$router.push({
            name: "VideoDetail",
            params: { id: this.videoListItem.vid, type: "video" },
          });
        }
      }
      this.isShowIcon = true;
      this.isShowPlay = false;
    },
  },
};
</script>

<style lang="less" scoped>
.video-list-item {
  width: 24%;
  padding-bottom: 0;
  margin-right: 12px;
  cursor: pointer;

  .item-img {
    position: relative;

    img {
      width: 100%;
      height: 180px;
    }
  }

  .mask-playicon {
    .iconfont {
      font-size: 42px;
    }
  }

  .play-icon {
    position: absolute;
    top: 0;
    right: 0;
    height: 30px;
    line-height: 30px;
    padding: 0 5px;
    background-color: rgba(100, 100, 100, 0.1);
    color: #fff;
  }

  .play-duration {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 30px;
    line-height: 30px;
    background-color: rgba(100, 100, 100, 0.1);
    color: #fff;

    span {
      padding: 5px;
    }
  }
}

.item-text {
  padding: 10px;
  p {
    padding-bottom: 5px;
  }
}
</style>