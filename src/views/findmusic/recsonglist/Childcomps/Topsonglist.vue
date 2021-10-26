<template>
  <div
    class="topsonglist"
    v-if="topsonglist.length !== 0"
    @mouseover="showPlay"
    @mouseleave="closePlay"
    @click="topSongClick"
  >
    <div class="image">
      <img v-lazy="topsonglist[0].coverImgUrl" />
      <img class="bgImg" v-lazy="topsonglist[0].coverImgUrl" />
      <transition name="el-fade-in-linear">
        <div class="mask-playicon" v-show="isShowPlay">
          <span class="iconfont icon-bofang"></span>
        </div>
      </transition>
    </div>
    <div class="info">
      <div class="hd">
        <el-divider content-position="left">
          <h2>精品歌单</h2>
        </el-divider>
      </div>
      <div class="title">
        <p>{{ topsonglist[0].name }}</p>
      </div>
      <div class="desc">
        <p>{{ topsonglist[0].description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Topsonglist",
  props: {
    topsonglist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isShowPlay: false,
    };
  },
  methods: {
    showPlay() {
      this.isShowPlay = true;
    },
    closePlay() {
      this.isShowPlay = false;
    },
    topSongClick() {
      this.$router.push("/songlistdetail/" + this.topsonglist[0].id);
    },
  },
};
</script>

<style lang="less" scoped>
.topsonglist {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;

  .image {
    position: relative;
    width: 16%;
    cursor: pointer;

    img {
      width: 100%;
    }

    .iconfont {
      font-size: 42px;
    }
  }

  .info {
    width: 80%;

    .title {
      padding-bottom: 5px;
      font-size: 16px;
    }

    .desc {
      height: 110px;
      font-size: 12px;
      color: #909399;
      overflow-y: scroll;
    }
  }
}

::-webkit-scrollbar {
  width: 3px;
  height: 12px;
  background-color: #fff;
}
</style>