<template>
  <div class="simiitem" @click="simiVideoClick">
    <div class="item-img">
      <img class="bgImg" :src="simiitem.cover || simiitem.coverUrl" alt="" />
      <img :src="simiitem.cover || simiitem.coverUrl" alt="" />
      <div class="play-icon">
        <span class="iconfont icon-play-square"> </span>
        <span class="count">{{
          simiitem.playCount || simiitem.playTime | formatNum
        }}</span>
      </div>
      <div class="playduration">
        <span>{{
          simiitem.duration || simiitem.durationms | formatDuration
        }}</span>
      </div>
    </div>
    <div class="item-text">
      <div class="tname">
        {{ simiitem.name || simiitem.title }}
      </div>
      <p class="by">
        by {{ simiitem.artistName || simiitem.creator[0].userName }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimilarItem",
  props: {
    simiitem: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    simiVideoClick() {
      if (this.$route.params.type == "mv") {
        this.$router.push({
          name: "VideoDetail",
          params: { id: this.simiitem.id, type: "mv" },
        });
      } else if (this.$route.params.type == "video") {
        this.$router.push({
          name: "VideoDetail",
          params: { id: this.simiitem.vid, type: "video" },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.simiitem {
  display: flex;
  align-items: center;
  padding: 10px 5px;
  cursor: pointer;
}

.item-img {
  flex: 4;
  position: relative;

  img {
    width: 100%;
  }

  .play-icon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 5px;
    background: rgba(100, 100, 100, 0.5);
    color: #fff;

    .count {
      padding-left: 3px;
      font-size: 14px;
    }
  }

  .playduration {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(100, 100, 100, 0.5);
    color: #fff;

    span {
      padding: 5px;
    }
  }
}

.item-text {
  flex: 2;
  padding-left: 30px;

  .tname {
    padding-bottom: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>