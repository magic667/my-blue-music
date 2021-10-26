<template>
  <div class="songlist" v-if="songList.length !== 0">
    <!-- 歌单列表 -->
    <div class="song-list">
      <song-list-item
        v-for="(item, index) in songList"
        :key="index"
        :song-list-item="item"
      ></song-list-item>
    </div>
  </div>
</template>

<script>
import SongListItem from "./SongListItem.vue";
export default {
  name: "SongList",
  components: { SongListItem },
  props: {
    songList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
.song-list {
  display: grid;
  justify-content: space-between;
  align-content: space-between;
  grid-template-rows: repeat(8, auto-fill);
  grid-template-columns: repeat(6, 15%);
}
</style>