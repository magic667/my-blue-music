<template>
  <div id="album-detail" class="w">
    <!-- 顶部专辑基本信息 -->
    <AlbumTopInfo
      :dynamic="dynamic"
      :albuminfo="albuminfo"
      :is-sub="isSub"
      @playAllSong="playAllSong"
      @subAlbumBy="subAlbumBy"
    />
    <!-- 底部专辑内容 -->
    <div class="singer-works">
      <el-tabs>
        <!-- 专辑歌曲列表 -->
        <el-tab-pane label="歌曲列表">
          <SongTable
            :songs="albumsong"
            v-if="albumsong.length !== 0"
          ></SongTable>
        </el-tab-pane>
        <!-- 专辑评论 -->
        <el-tab-pane>
          <span slot="label">评论({{ commentCount }})</span>
          <CommentPage
            :comments="comments"
            :hotcomments="hotcomments"
            :comment-count="commentCount"
            :comment-type="3"
            :commentres-id="id"
            @updateComment="getAlbumCommentBy"
            @changePage="changePage"
          ></CommentPage>
        </el-tab-pane>
        <!-- 专辑详情 -->
        <el-tab-pane label="专辑详情">
          <div class="album-desc" v-if="albuminfo.description">
            <p>{{ albuminfo.description }}</p>
          </div>
          <div class="no" v-else>
            <h2>暂无详情</h2>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getAlbumDynamic,
  getAlbumSong,
  getAlbumComment,
  subAlbum,
} from "network/albumdetail/albumdetail";
import { getSongUrl } from "network/playmusic/playmusic.js";
import { getSubAlbum } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import AlbumTopInfo from "./Childcomps/AlbumTopInfo.vue";
import SongTable from "components/content/SongTable.vue";
import CommentPage from "components/content/comment/CommentPage.vue";

export default {
  name: "Albumdetail",
  components: { AlbumTopInfo, SongTable, CommentPage },
  data() {
    return {
      id: "",
      dynamic: {},
      albuminfo: {},
      albumsong: [],
      comments: [],
      hotcomments: [],
      commentCount: 0, // 评论数量
      isSub: false, // 是否收藏此专辑
    };
  },
  computed: {
    ...mapGetters(["subAlbumlist"]),
  },
  created() {
    this.id = this.$route.params.id;
    this.getAlbumDynamicBy();
    this.getAlbumSongBy();
    this.getAlbumCommentBy();
    // 获取用户收藏的专辑列表
    if (this.subAlbumlist.length == 0) {
      this.getUserSubAlbum();
      return;
    }
    // 判断是否收藏了当前专辑
    this.isSubAlbum();
  },
  methods: {
    // 获取专辑动态信息，如收藏，分享数据
    getAlbumDynamicBy() {
      getAlbumDynamic(this.id).then((res) => {
        this.dynamic = res.data;
      });
    },
    // 获取专辑歌曲
    getAlbumSongBy() {
      getAlbumSong(this.id).then((res) => {
        this.albuminfo = res.data.album;
        this.albumsong = res.data.songs;
      });
    },
    // 获取专辑评论
    getAlbumCommentBy(page = 1) {
      let offset = (page - 1) * 20;
      let timestamp = Date.parse(new Date());
      getAlbumComment(this.id, offset, timestamp).then((res) => {
        this.hotcomments = res.data.hotComments;
        this.comments = res.data.comments;
        this.commentCount = res.data.total;
      });
    },
    // 事件监听
    // 评论分页事件
    changePage(page) {
      this.getAlbumCommentBy(page);
      let view = document.querySelector(".view");
      view.scrollTo({
        behavior: "smooth",
        top: 300,
      });
    },
    // 播放全部歌曲事件
    playAllSong() {
      this.$store.dispatch("addAllSong", this.albumsong);
      // 默认播放第一首歌
      getSongUrl(this.albumsong[0].id).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
      });
      // 保存当前歌曲详情
      this.$store.dispatch("saveSongDetail", this.albumsong[0]);
    },
    // 收藏专辑事件
    // 获取用户收藏的专辑列表
    getUserSubAlbum() {
      let timestamp = Date.parse(new Date());
      getSubAlbum(timestamp).then((res) => {
        this.$store.dispatch("saveFavoriteAlbum", res.data.data);
        this.isSubAlbum();
      });
    },
    // 判断是否收藏了当前专辑
    isSubAlbum() {
      let index = this.subAlbumlist.findIndex((item) => {
        return item.id == this.id;
      });
      if (index == -1) {
        this.isSub = false;
      } else {
        this.isSub = true;
      }
    },
    // 点击收藏按钮
    subAlbumBy() {
      // 1为收藏，其他为取消收藏
      let t = !this.isSub ? 1 : 2;
      subAlbum(t, this.id).then((res) => {
        if (res.data.code == 200) {
          // 重新获取用户收藏的专辑
          this.getUserSubAlbum();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.album-desc {
  p {
    text-indent: 24px;
  }
}
</style>