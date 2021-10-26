<template>
  <div class="video w">
    <div class="logined" v-if="$store.state.isLogin">
      <!-- 标签导航 -->
      <TagsNav
        :all-tag="allTag"
        :hot-tag="hotTag"
        @tagClick="tagClick"
      ></TagsNav>
      <!-- 视频列表 -->
      <div class="video-list" v-infinite-scroll="load" style="overflow: auto">
        <VideoList :video-list="videoList" v-if="hasmore" />
        <div class="novideo" v-else>
          <el-empty
            description="暂无视频，请稍后重试"
            :image-size="200"
          ></el-empty>
        </div>
      </div>
    </div>
    <div class="nologin" v-if="!$store.state.isLogin">
      <el-empty description="登录后才能查看" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import {
  getAllVideoTags,
  getHotVideoTags,
  getGroupVideoList,
} from "network/recvideo/recvideo";
import TagsNav from "components/content/TagsNav.vue";
import VideoList from "components/content/videolist/VideoList.vue";

export default {
  name: "Video",
  components: { TagsNav, VideoList },
  data() {
    return {
      allTag: [],
      hotTag: [],
      videoList: [],
      tagId: "",
      offset: 0,
      hasmore: true,
      isLoading: false,
    };
  },
  computed: {
    disabled() {
      return this.isLoading;
    },
  },
  created() {
    if (!this.$store.state.isLogin) {
      this.$message({
        types: "warning",
        message: "登录后才能查看",
        showClose: true,
        center: true,
      });
      return;
    }
    // 获取全部视频标签
    this.getAllVideoTagsBy();
    // 获取热门视频标签
    this.getHotVideoTagsBy();
  },
  activated() {
    let view = document.querySelector(".view");
    view.style.overflow = "hidden";
  },
  deactivated() {
    let view = document.querySelector(".view");
    view.style.overflow = "auto";
  },
  methods: {
    // 获取全部视频标签
    getAllVideoTagsBy() {
      getAllVideoTags().then((res) => {
        this.allTag = res.data.data;
      });
    },
    // 获取热门视频标签
    getHotVideoTagsBy() {
      getHotVideoTags().then((res) => {
        this.hotTag = res.data.data;
        this.tagId = this.hotTag[0].id;
        // 默认获取现场分类视频列表
        this.getGroupVideoListBy(this.tagId);
      });
    },
    // 获取分类视频列表
    getGroupVideoListBy(id) {
      getGroupVideoList(id, this.offset).then((res) => {
        // 是否还有更多
        this.hasmore = res.data.hasmore;
        this.offset += 1;
        this.videoList.push(...res.data.datas);
      });
    },
    // 上拉加载更多
    load() {
      if (this.hasmore) {
        this.getGroupVideoListBy(this.tagId);
      } else {
        this.$message.warning("没有更多了");
      }
    },
    // 标签点击事件
    tagClick(tagName, id) {
      this.offset = 0;
      this.tagId = id;
      this.videoList = [];
      this.getGroupVideoListBy(id);
    },
  },
};
</script>

<style lang="less" scoped>
.video-list {
  margin-top: 10px;
  height: calc(100vh - 200px);
}

::-webkit-scrollbar {
  width: 0px;
  height: 12px;
  background-color: #fff;
}
</style>