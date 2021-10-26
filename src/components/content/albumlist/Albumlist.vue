<template>
  <div class="album-list">
    <AlbumListItem
      v-for="(item, index) in albumlist"
      :key="index"
      :album-list-item="item"
    />
  </div>
</template>
<script>
import AlbumListItem from "./AlbumListItem.vue";

export default {
  name: "Albumlist",
  components: { AlbumListItem },
  props: {
    albumlist: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style lang="less" scoped>
.album-list {
  // display: grid;
  // justify-content: space-around;
  // align-content: space-between;
  // grid-template-rows: repeat(8, auto-fill);
  // grid-template-columns: repeat(5, 15%);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>
