<template>
  <div class="favorite-mv w">
    <el-divider content-position="left">
      <h2>我收藏的视频和MV</h2>
    </el-divider>
    <VideoList :video-list="favoriteMv"></VideoList>
    <div v-if="favoriteMv.length == 0">
      <el-empty description="还没有收藏的视频" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getSubMv } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import VideoList from "components/content/videolist/VideoList.vue";

export default {
  name: "FavoriteMv",
  components: { VideoList },
  data() {
    return {
      favoriteMv: [],
      mvcount: 0,
    };
  },
  computed: {
    ...mapGetters(["subMvlist"]),
  },
  created() {
    if (this.subMvlist.length == 0) {
      this.getSubMv();
    } else {
      this.favoriteMv = this.subMvlist;
      this.mvcount = this.subMvlist.length;
    }
  },
  methods: {
    getSubMv() {
      let timestamp = Date.parse(new Date());
      getSubMv(timestamp).then((res) => {
        this.favoriteMv = res.data.data;
        this.mvcount = res.data.count;
        this.$store.dispatch("saveFavoriteMv", res.data.data);
      });
    },
  },
};
</script>

<style>
</style>