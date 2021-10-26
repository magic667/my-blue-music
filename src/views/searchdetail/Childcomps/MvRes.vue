<template>
  <div class="mv-res">
    <div class="result">
      <h3>
        搜索<span style="color: #5292fe">{{ this.keywords }}</span
        >,找到{{ mvResCount }}个MV
      </h3>
    </div>
    <VideoList :video-list="mvRes" />
    <!-- 分页器 -->
    <div class="page" v-if="mvRes.length !== 0 && mvResCount > 40">
      <el-pagination
        background
        @current-change="changmvPage"
        :page-size="40"
        layout="total, prev, pager, next"
        :total="mvResCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchMv } from "network/searchdetail/searchdetail";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
  name: "MvRes",
  components: { VideoList },
  data() {
    return {
      keywords: "", //关键词
      mvRes: [],
      mvResCount: null,
    };
  },
  created() {
    // 保存搜索的关键词
    this.keywords = this.$route.params.keywords;
    this.getSearchMvBy(1);
  },
  methods: {
    getSearchMvBy(page) {
      let offset = (page - 1) * 40;
      getSearchMv(this.keywords, offset).then((res) => {
        this.mvRes = res.data.result.mvs;
        this.mvResCount = res.data.result.mvCount;
      });
    },
    changmvPage(page) {
      this.getSearchMvBy(page);
      // 返回顶部
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
