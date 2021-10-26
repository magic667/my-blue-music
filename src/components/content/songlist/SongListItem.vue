<template>
  <div
    class="item"
    v-if="Object.keys(songListItem).length !== 0"
    @click="listItemClick"
  >
    <div class="item-img" @mouseenter="showIcon" @mouseleave="closeIcon">
      <!-- 图片上的播放图标，鼠标经过时显示 -->
      <transition name="el-fade-in-linear">
        <div class="mask-playicon" v-show="isShowPlay">
          <span class="iconfont icon-bofang"></span>
        </div>
      </transition>
      <!-- 图片上方遮罩层1，显示歌单播放量 -->
      <transition name="el-fade-in-linear">
        <div class="mask1" v-if="songListItem.playCount" v-show="isShowIcon">
          <span class="iconfont icon-yinle"></span>
          <span>{{ songListItem.playCount | formatNum }}</span>
        </div>
      </transition>
      <!-- 图片下方遮罩层2，显示歌单作者名 -->
      <transition name="el-zoom-in-bottom">
        <div class="mask2" v-if="songListItem.creator" v-show="isShowIcon">
          <span class="iconfont">&#xe841;</span>
          <span>{{ songListItem.creator.nickname }}</span>
        </div>
      </transition>
      <!-- 歌单图片本体 -->
      <img v-lazy="showImg" />
    </div>
    <div class="item-text">
      <p>{{ songListItem.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongListItem",
  props: {
    songListItem: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    return {
      isShowIcon: true, // 播放量显示与隐藏
      isShowPlay: false, // 播放图标遮罩层的显示与隐藏
    };
  },
  computed: {
    showImg() {
      //用于显示正确的图片
      return this.songListItem.picUrl || this.songListItem.coverImgUrl;
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
    // 歌单点击事件
    listItemClick() {
      // 根据歌单id跳转歌单详情页
      this.$router.push("/songlistdetail/" + this.songListItem.id);
      // 遮罩显示
      this.isShowIcon = true;
      this.isShowPlay = false;
    },
  },
};
</script>

<style lang="less" scoped>
.item {
  width: 100%;
  height: 100%;
  margin-bottom: 15px;
  cursor: pointer;

  .item-img {
    position: relative;

    img {
      width: 100%;
    }

    .mask1 {
      position: absolute;
      top: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: right;
      color: #fff;
      font-size: 13px;
      padding-right: 7px;
      span {
        padding-left: 5px;
      }
    }

    .mask2 {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: left;
      color: #fff;
      font-size: 13px;
      padding-left: 7px;
      span {
        padding-right: 5px;
      }
    }

    .mask-playicon {
      height: 180px !important;
      box-shadow: 0 0 5px 5px #e5e5ff;

      .iconfont {
        font-size: 42px;
      }
    }
  }

  .item-text {
    margin: 5px 0;
  }
}
</style>