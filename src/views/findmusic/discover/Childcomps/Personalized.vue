<template>
  <div class="personalized" v-if="personalized.length !== 0">
    <div class="hd">
      <el-divider content-position="left">
        <h2>推荐歌单</h2>
      </el-divider>
    </div>
    <div class="bd">
      <SongList :song-list="personalized"></SongList>
    </div>
  </div>
</template>

<script>
import SongList from "components/content/songlist/SongList.vue";

export default {
  name: "Personalized",
  components: { SongList },
  props: {
    personalized: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style>
</style>