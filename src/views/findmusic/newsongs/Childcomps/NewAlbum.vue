<template>
  <div class="new-album">
    <div class="hd" ref="hdTypeNav">
      <TypeNav :typeitem="typeitem" @typeItemClick="typeItemClick"></TypeNav>
    </div>
    <div class="bd" v-if="newalbum.length !== 0">
      <Albumlist :albumlist="newalbum"></Albumlist>
      <div class="page">
        <el-pagination
          background
          @current-change="changeAlbumPage"
          :page-size="50"
          layout="total, prev, pager, next"
          :total="albumCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getNewAlbum } from "network/findmusic/newsongs/newsongs";
import TypeNav from "./TypeNav.vue";
import Albumlist from "components/content/albumlist/Albumlist.vue";

export default {
  name: "NewAlbum",
  components: { TypeNav, Albumlist },
  data() {
    return {
      typeitem: [
        { type: "全部", code: "ALL" },
        { type: "华语", code: "ZH" },
        { type: "欧美", code: "EA" },
        { type: "日本", code: "JP" },
        { type: "韩国", code: "KR" },
      ],
      currentArea: "ALL", // 当前分类区域
      newalbum: [],
      albumCount: null,
    };
  },
  created() {
    this.getNewAlbumBy();
  },
  methods: {
    // 默认获取全部分类的专辑
    getNewAlbumBy(area = "ALL", page = 1) {
      let offset = (page - 1) * 60;
      getNewAlbum(offset, area).then((res) => {
        this.newalbum = res.data.albums;
        this.albumCount = res.data.total;
      });
    },
    // 分类导航事件
    typeItemClick(area) {
      this.currentArea = area;
      this.getNewAlbumBy(area);
    },
    // 分页事件
    changeAlbumPage(page) {
      this.getNewAlbumBy(this.currentArea, page);
      let view = document.querySelector(".view");
      // 滚动到开始位置
      view.scrollTo({
        top: this.$refs.hdTypeNav.offsetTop - 60,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bd {
  margin-top: 30px;
}
</style>