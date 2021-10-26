<template>
  <div class="banner" v-if="banner.length !== 0">
    <el-carousel :interval="4000" type="card" height="220px">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="item.imageUrl" @click="playMusic(item.targetId)" />
        <div class="title">{{ item.typeTitle }}</div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { getSongUrl } from "network/playmusic/playmusic.js";
import { getEverySongDetail } from "network/songlistdetail/songlistdetail.js";
export default {
  name: "Banner",
  props: {
    banner: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    playMusic(id) {
      if (id == 0) {
        return;
      }
      // 获取歌曲url
      getSongUrl(id).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
      });
      // 根据歌曲id获取每首歌的信息
      getEverySongDetail(id).then((res) => {
        if (res.data.songs[0]) {
          // 提交vuex保存当前歌曲详情
          this.$store.dispatch("saveSongDetail", res.data.songs[0]);
          // 提交vuex添加到播放列表
          this.$store.dispatch("addPlayinglist", res.data.songs[0]);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.banner {
  position: relative;
  img {
    width: 100%;
  }
}

.title {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 3px 8px;
  background: #409eff;
  font-size: 12px;
  color: #fff;
}
</style>