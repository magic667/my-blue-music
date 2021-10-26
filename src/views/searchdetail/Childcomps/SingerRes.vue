<template>
  <div class="singer-res">
    <div class="result">
      <h3>
        搜索<span style="color: #5292fe">{{ this.keywords }}</span>
        <span>,找到{{ singerResCount }}位歌手</span>
      </h3>
    </div>
    <div class="singerRes">
      <Singerlist :singerlist="singerRes"></Singerlist>
    </div>
    <!-- 分页器 -->
    <div class="page" v-if="singerRes.length !== 0 && singerResCount > 30">
      <el-pagination
        background
        @current-change="changeSingerPage"
        :page-size="30"
        layout="total, prev, pager, next"
        :total="singerResCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchSinger } from "network/searchdetail/searchdetail";
import Singerlist from "components/content/singerlist/Singerlist.vue";

export default {
  name: "SingerRes",
  components: { Singerlist },
  data() {
    return {
      keywords: "",
      singerRes: [],
      singerResCount: null,
    };
  },
  created() {
    // 保存搜索关键字
    this.keywords = this.$route.params.keywords;
    this.getSearchSingerBy();
  },
  methods: {
    getSearchSingerBy(page = 1) {
      let offset = (page - 1) * 30;
      getSearchSinger(this.keywords, offset).then((res) => {
        this.singerRes = res.data.result.artists;
        this.singerResCount = res.data.result.artistCount;
      });
    },
    // 分页事件
    changeSingerPage(page) {
      this.getSearchSingerBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  padding: 10px 0px 15px;
}
</style>