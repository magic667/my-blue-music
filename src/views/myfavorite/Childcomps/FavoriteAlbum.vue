<template>
  <div class="favorite-album w">
    <el-divider content-position="left">
      <h2>我收藏的专辑({{ albumcount }})</h2>
    </el-divider>
    <Albumlist
      :albumlist="favoriteAlbum"
      v-if="favoriteAlbum.length !== 0"
    ></Albumlist>
    <div v-if="favoriteAlbum.length == 0">
      <el-empty description="还没有收藏的专辑" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getSubAlbum } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import Albumlist from "components/content/albumlist/Albumlist.vue";

export default {
  name: "FavoriteAlbum",
  components: { Albumlist },
  data() {
    return {
      favoriteAlbum: [],
      albumcount: 0,
    };
  },
  computed: {
    ...mapGetters(["subAlbumlist"]),
  },
  created() {
    if (this.subAlbumlist.length == 0) {
      this.getSubAlbumBy();
    } else {
      this.favoriteAlbum = this.subAlbumlist;
      this.albumcount = this.subAlbumlist.length;
    }
  },
  methods: {
    getSubAlbumBy() {
      let timestamp = Date.parse(new Date());
      getSubAlbum(timestamp).then((res) => {
        this.favoriteAlbum = res.data.data;
        this.albumcount = res.data.count;
        this.$store.dispatch("saveFavoriteAlbum", res.data.data);
      });
    },
  },
};
</script>

<style>
</style>