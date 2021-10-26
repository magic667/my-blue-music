<template>
  <div class="singer-list" v-if="singerlist.length !== 0">
    <SingerListItem
      v-for="(item, index) in singerlist"
      :key="index"
      :singeritem="item"
    ></SingerListItem>
  </div>
</template>

<script>
import SingerListItem from "./SingerListItem.vue";

export default {
  name: "Singlist",
  components: { SingerListItem },
  props: {
    singerlist: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
.singer-list {
  display: grid;
  align-content: space-between;
  justify-content: space-between;
  grid-template-rows: reqeat(8, auto-fill);
  grid-template-columns: repeat(6, 15%);
}
</style>