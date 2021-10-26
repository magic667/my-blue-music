<template>
  <div class="favorite-singer w">
    <el-divider content-position="left">
      <h2>我收藏的歌手</h2>
    </el-divider>
    <Singerlist :singerlist="favoriteSinger"></Singerlist>
    <div v-if="favoriteSinger.length == 0">
      <el-empty description="还没有关注的歌手" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getSubSinger } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import Singerlist from "components/content/singerlist/Singerlist.vue";

export default {
  name: "FavoriteSinger",
  components: { Singerlist },
  data() {
    return {
      favoriteSinger: [],
      singercount: 0,
    };
  },
  computed: {
    ...mapGetters(["subSingerlist"]),
  },
  created() {
    if (this.subSingerlist.length == 0) {
      this.getSubSingerBy();
    } else {
      this.favoriteSinger = this.subSingerlist;
      this.singercount = this.subSingerlist.length;
    }
  },
  methods: {
    getSubSingerBy() {
      let timestamp = Date.parse(new Date());
      getSubSinger(timestamp).then((res) => {
        this.favoriteSinger = res.data.data;
        this.singercount = res.data.count;
        this.$store.dispatch("saveFavoriteSinger", res.data.data);
      });
    },
  },
};
</script>

<style>
</style>