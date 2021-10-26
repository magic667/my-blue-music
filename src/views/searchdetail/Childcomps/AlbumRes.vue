<template>
  <div class="album-res">
    <div class="result">
      <h3>
        搜索<span style="color: #5292fe">{{ this.keywords }}</span
        >,找到{{ albumRes.albumCount }}张专辑
      </h3>
    </div>
    <SingerAlbum :albumlist="albumRes.albums" />
    <!-- 分页器 -->
    <div
      class="page"
      v-if="albumRes.albumCount > 30 && albumRes.albums.length !== 0"
    >
      <el-pagination
        background
        @current-change="changAlbumPage"
        :page-size="30"
        layout="total, prev, pager, next"
        :total="albumRes.albumCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchAlbum } from "network/searchdetail/searchdetail";
import SingerAlbum from "../../singerdetail/Childcomps/SingerAlbum.vue";

export default {
  name: "AlbumRes",
  components: { SingerAlbum },
  data() {
    return {
      keywords: "",
      albumRes: {},
    };
  },
  created() {
    this.keywords = this.$route.params.keywords;
    this.getSearchAlbumBy();
  },
  methods: {
    getSearchAlbumBy(page = 1) {
      let offset = (page - 1) * 30;
      getSearchAlbum(this.keywords, offset).then((res) => {
        this.albumRes = res.data.result;
      });
    },
    changeAlbumPage(page) {
      this.getSearchAlbumBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  padding: 15px 10px;
}
</style>