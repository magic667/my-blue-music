<template>
  <div class="newsongs w">
    <div class="top-nav">
      <TabBar :tab-items="tabitems" @tabItemClick="tabItemClick"></TabBar>
    </div>
    <div class="new-content">
      <NewMusic v-if="activeItem == 0"></NewMusic>
      <NewAlbum v-if="activeItem == 1"></NewAlbum>
    </div>
  </div>
</template>

<script>
import TabBar from "components/common/TabBar.vue";
import NewMusic from "./Childcomps/NewMusic.vue";
import NewAlbum from "./Childcomps/NewAlbum.vue";

export default {
  name: "NewSongs",
  components: { TabBar, NewMusic, NewAlbum },
  data() {
    return {
      tabitems: [{ name: "新歌速递" }, { name: "新碟上架" }],
      activeItem: 0,
    };
  },
  methods: {
    tabItemClick(index) {
      this.activeItem = index;
    },
  },
};
</script>

<style lang="less" scoped>
.top-nav {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>