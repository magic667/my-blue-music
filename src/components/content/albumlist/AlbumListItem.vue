<template>
  <div class="item" @click="listItemClick">
    <!-- 歌单图片 -->
    <div class="item-img" @mouseenter="showIcon" @mouseleave="closeIcon">
      <!-- 播放图标 -->
      <transition name="el-fade-in-linear">
        <div class="album-playicon" v-show="isShowPlay">
          <span class="iconfont icon-play1"></span>
        </div>
      </transition>
      <!-- 图片 -->
      <div class="album-img" v-lazy-container="{ selector: 'img' }">
        <img
          :data-src="albumListItem.picUrl"
          :data-loading="require('assets/imgs/loading.png')"
        />
      </div>
      <!-- 唱片图 -->
      <img class="record" src="~assets/imgs/cp2.png" />
      <div class="box"></div>
    </div>
    <!-- 歌单下方的文字描述 -->
    <div class="item-text">
      <p class="album-name">
        <span>{{ albumListItem.name }}</span>
        <span class="by" style="padding-left: 10px">
          {{ albumListItem.artists[0].name }}
        </span>
      </p>
      <p v-if="albumListItem.publishTime" class="by publishtime">
        {{ albumListItem.publishTime | showDate }}
      </p>
      <p v-if="albumListItem.subTime" class="by">
        {{ albumListItem.subTime | showDate }}
      </p>
    </div>
  </div>
</template>

<script>
import { formatDate } from "common/formatDate";

export default {
  name: "AlbumListItem",
  props: {
    albumListItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 播放图标遮罩层
      isShowPlay: false,
    };
  },
  filters: {
    showDate(value) {
      const date = new Date(value);
      return formatDate(date, "yyyy-MM-dd");
    },
  },
  methods: {
    showIcon() {
      this.isShowPlay = true;
    },
    closeIcon() {
      this.isShowPlay = false;
    },
    listItemClick() {
      this.$router.push("/albumdetail/" + this.albumListItem.id);
      this.closeIcon();
    },
  },
};
</script>

<style lang="less"scoped>
.item {
  width: 15%;
  cursor: pointer;
  margin: 0 20px;

  .item-img {
    position: relative;

    .album-img {
      width: 100%;
    }

    img {
      width: 100%;
    }

    .album-playicon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(100, 100, 100, 0.3);

      .iconfont {
        font-size: 42px;
        color: #fff;
      }
    }

    .box {
      position: absolute;
      top: 7.5%;
      left: 36px;
      width: 85%;
      height: 85%;
      background: rgba(100, 100, 100, 0.3);
      border: 1px solid #d5d5d8;
      z-index: -1;
    }

    .record {
      position: absolute;
      top: 0px;
      left: 28px;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }

  .item-text {
    margin: 5px 0;
    font-size: 14px;

    .album-name,
    .publishtime {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>