<template>
  <div class="rank-global">
    <div class="hd">
      <el-divider conent-position>
        <h2>全球榜</h2>
      </el-divider>
    </div>
    <div class="bd">
      <SongList :song-list="rankglobal"></SongList>
    </div>
  </div>
</template>

<script>
import SongList from "components/content/songlist/SongList.vue";

export default {
  name: "Rankfeature",
  components: { SongList },
  props: {
    rankglobal: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
</style>