<template>
  <div class="mv w">
    <!-- 顶部分类标签 -->
    <div class="tags">
      <TagsBar :taglist="areaList" @tagBarClick="areaClick"></TagsBar>
      <TagsBar :taglist="typeList" @tagBarClick="typeClick"></TagsBar>
    </div>
    <!-- MV列表 -->
    <div class="mv-list" ref="myList">
      <VideoList :video-list="mvList"></VideoList>
    </div>
    <!-- 分页器 -->
    <div class="page">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="40"
        layout="prev, pager, next"
        :total="mvCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllMv } from "network/recvideo/recvideo";
import VideoList from "components/content/videolist/VideoList.vue";
import TagsBar from "components/content/TagsBar.vue";

export default {
  name: "Mv",
  components: { VideoList, TagsBar },
  data() {
    return {
      areaList: {
        category: "地区",
        list: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
      },
      typeList: {
        category: "类型",
        list: ["全部", "官方版", "原生", "现场版", "网易出品"],
      },
      mvList: [],
      mvCount: 0,
      currentPage: 1,
      area: "全部",
      type: "全部",
      limit: 40,
      page: 1,
    };
  },
  created() {
    this.getAllMvBy("全部", "全部", 1);
  },
  methods: {
    // 请求MV数据
    getAllMvBy(area, type, page) {
      let offset = (page - 1) * this.limit;
      getAllMv(area, type, offset).then((res) => {
        this.mvList = res.data.data;
        if (res.data.count) {
          this.mvCount = res.data.count;
        }
      });
    },
    // 标签点击事件
    areaClick(item) {
      this.currentPage = 1;
      this.area = item;
      this.getAllMvBy(item, this.type, this.page);
    },
    typeClick(item) {
      this.currentPage = 1;
      this.type = item;
      this.getAllMvBy(this.area, item, this.page);
    },
    // 分页事件
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getAllMvBy(this.area, this.type, page);
      let view = document.querySelector(".view");
      view.scrollTo({
        top: this.$refs.myList.offsetTop - 60,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.mv {
  position: relative;
}

.mv-list {
  padding-top: 30px;
}
</style>