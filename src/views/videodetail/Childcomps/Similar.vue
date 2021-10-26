<template>
  <div class="similar">
    <h2>相关推荐</h2>
    <SimilarItem
      :simiitem="item"
      v-for="(item, index) in similar"
      :key="index"
    ></SimilarItem>
  </div>
</template>

<script>
import SimilarItem from "./SimilarItem.vue";

export default {
  name: "Similar",
  components: { SimilarItem },
  props: {
    similar: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
    },
  },
};
</script>

<style lang="less" scoped>
</style>