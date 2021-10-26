<template>
  <div class="video-res">
    <div class="result">
      <h3>
        搜索<span style="color: #5292fe">{{ this.keywords }}</span
        >,找到{{ videoResCount }}个视频
      </h3>
    </div>
    <VideoList :video-list="videoRes" />
    <!-- 分页器 -->
    <div class="page" v-if="videoRes.length !== 0 && videoResCount > 40">
      <el-pagination
        background
        @current-change="changvideoPage"
        :page-size="40"
        layout="total, prev, pager, next"
        :total="videoResCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchVideo } from "network/searchdetail/searchdetail";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
  name: "VideoRes",
  components: { VideoList },
  data() {
    return {
      keywords: "",
      videoRes: [],
      videoResCount: null,
    };
  },
  created() {
    this.keywords = this.$route.params.keywords;
    this.getSearchVideoBy();
  },
  methods: {
    getSearchVideoBy(page = 1) {
      let offset = (page - 1) * 40;
      getSearchVideo(this.keywords, offset).then((res) => {
        this.videoRes = res.data.result.videos;
        this.videoResCount = res.data.result.videoCount;
      });
    },
    changvideoPage(page) {
      this.getSearchVideoBy(page);
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
