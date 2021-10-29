<template>
  <div id="recsong-list" class="w">
    <!-- 顶部精品歌单 -->
    <Topsonglist :topsonglist="topsonglist"></Topsonglist>
    <!-- 标签导航 -->
    <div class="tagsnav" ref="tagsnav">
      <TagsNav
        :all-tag="allTag"
        :hot-tag="hotTag"
        @tagClick="tagClick"
      ></TagsNav>
    </div>
    <!-- 歌单列表 -->
    <div class="songlist">
      <SongList :song-list="songlist"></SongList>
    </div>
    <!-- 分页器 -->
    <div class="page" v-if="songlist.length !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="48"
        layout="total, prev, pager, next"
        :total="songlistCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getTopHighqualityTag,
  getTopHighquality,
  getAllTag,
  getHotTag,
  getSongList,
} from "network/findmusic/recsonglist/recsonglist";
import { getRandom } from "common/getRandom";
import Topsonglist from "./Childcomps/Topsonglist.vue";
import SongList from "components/content/songlist/SongList.vue";
import TagsNav from "components/content/TagsNav.vue";

export default {
  name: "Recsonglist",
  components: { Topsonglist, SongList, TagsNav },
  data() {
    return {
      tags: [], // 精品歌单标签列表
      topsonglist: [], // 顶部精品歌单
      allTag: [], // 所有歌单标签
      hotTag: [], // 热门标签
      songlist: [], // 歌单列表
      songlistCount: Number,
      currentPage: 1, // 分页器默认当前页数
      tagName: "华语",
      limit: 48, // 歌单每页数量
      page: 1, // 默认页码
    };
  },
  created() {
    // 获取歌单页数据
    this.getAllTagBy();
    this.getHotTagBy();
    this.getTopHighqualityRandom();
    this.getSongListBy(this.tagName, this.limit, this.page);
  },
  methods: {
    // 获取所有歌单分类标签
    getAllTagBy() {
      getAllTag().then((res) => {
        this.allTag = res.data.sub;
      });
    },
    // 获取热门歌单分类标签
    getHotTagBy() {
      getHotTag().then((res) => {
        this.hotTag = res.data.tags;
      });
    },
    // 获取歌单列表
    getSongListBy(tagName, limit = 48, page) {
      let offset = (page - 1) * limit;
      getSongList(tagName, limit, offset).then((res) => {
        this.songlist = res.data.playlists;
        this.songlistCount = res.data.total;
      });
    },
    // 点击tag标签，随机获取一个顶部精品歌单
    getTopHighqualityRandom() {
      getTopHighqualityTag().then((res) => {
        // 获取精品歌单所有标签
        this.tags = res.data.tags;
        // 获取一个随机精品歌单标签
        let randomTag = this.tags[getRandom(0, this.tags.length - 1)].name;
        // 根据随机精品歌单标签，随机获取顶部精品歌单
        getTopHighquality(randomTag, 1).then((res) => {
          this.topsonglist = res.data.playlists;
        });
      });
    },
    // tag标签导航事件
    // 点击tag标签后，重新发送网络请求
    tagClick(tagName) {
      this.tagName = tagName;
      // 根据标签名重新获取顶部精品歌单
      // 单击的标签名可能不存在精品歌单标签列表里面，需要判断
      if (this.tags.find((item) => item.name == tagName)) {
        getTopHighquality(tagName, 1).then((res) => {
          this.topsonglist = res.data.playlists;
        });
      }
      // 根据标签名获取歌单列表(默认为第一页数据)
      // 如果当前不在第一页，需要将分页器调整到第一页
      this.getSongListBy(tagName, this.limit, this.page);
      this.currentPage = 1;
    },
    // 分页事件
    handleCurrentChange(page) {
      // 当前页码改变时触发(参数是当前页码)
      this.currentPage = page;
      this.getSongListBy(this.tagName, this.limit, page);
      // 滚动到歌单开始位置
      let view = document.querySelector(".view");
      view.scrollTo({
        behavior: "smooth",
        top: this.$refs.tagsnav.offsetTop - 65,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tagsnav {
  margin-top: 30px;
}

.songlist {
  margin-top: 20px;
}
</style>