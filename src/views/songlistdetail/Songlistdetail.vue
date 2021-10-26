<template>
  <div id="song-list-detail" class="w">
    <!-- 顶部歌单描述 -->
    <Topdesc
      :playlist="playlist"
      :is-sub="isSub"
      @playAllSong="playAllSong"
      @subSongListBy="subSongListBy"
    ></Topdesc>
    <div class="bot-song-list" v-if="songs.length !== 0">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 歌曲列表 -->
        <el-tab-pane label="歌曲列表" name="songs">
          <SongTable :songs="songs" @reloading="reload" />
        </el-tab-pane>
        <!-- 歌单评论 -->
        <el-tab-pane name="comment">
          <span slot="label">评论({{ commentCount }})</span>
          <CommentPage
            :comments="comments"
            :hotcomments="hotcomments"
            :comment-count="commentCount"
            :comment-type="2"
            :commentres-id="id"
            @updateComment="getCommentsBy"
            @changePage="changePage"
          ></CommentPage>
        </el-tab-pane>
        <!-- 歌单收藏者 -->
        <el-tab-pane name="subs" label="收藏者">
          <Subscribers
            :subscribers="subscribers"
            :totalcount="totalcount"
            @handlePage="handlePage"
          ></Subscribers>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getSongListDetail,
  getEverySongDetail,
  getSongListComment,
  getSongListSubscribers,
  subSongList,
} from "network/songlistdetail/songlistdetail";
import { getSongUrl } from "network/playmusic/playmusic.js";
import { getUserSonglist } from "network/userdetail/userdetail";
import { mapGetters } from "vuex";
import Topdesc from "./Childcomps/Topdesc.vue";
import Subscribers from "./Childcomps/Subscribers.vue";
import CommentPage from "components/content/comment/CommentPage.vue";
import SongTable from "components/content/SongTable.vue";

export default {
  inject: ["reload"],
  name: "Songlistdetail",
  components: { Topdesc, CommentPage, SongTable, Subscribers },
  data() {
    return {
      activeName: "songs", // 处于活跃的tabs名
      id: "", // 存储路由传递过来歌单id
      playlist: {}, // 歌单描述信息
      songids: "", // 歌单中所有歌曲id
      songs: [], // 歌单中所有歌曲详细信息
      hotcomments: [], // 热门评论
      comments: [], // 评论
      commentCount: null, // 评论总数
      subscribers: [], // 收藏者
      totalcount: null, // 收藏者数量
      isSub: false, // 是否收藏了当前歌单
    };
  },
  computed: {
    ...mapGetters(["userSongList", "userInfo"]),
  },
  watch: {
    // 路由push相同地址不同参数时 不会自动刷新页面
    // 通过watch监听路由变化，发生变化时进行reload刷新
    $route(to, from) {
      if (to !== from) {
        this.reload();
      }
    },
  },
  created() {
    this.id = this.$route.params.id;
    //  根据歌单id请求对应的歌单详情数据
    this.getSongListDetailBy();
    //  默认获取歌单第一页评论
    this.getCommentsBy();
    // 获取歌单收藏者
    this.getSongListSubscribersBy();
    // 判断用户是否收藏了该歌单
    this.isSubSongList();
  },
  mounted() {
    let name = sessionStorage.getItem("currentTab");
    // 判断是否存在currentTab，即tab页之前是否被点击切换到别的页面
    if (name) {
      this.activeName = name;
    }
  },
  beforeRouteLeave(to, from, next) {
    // 在离开此路由之后清除保存的状态（只需要在当前tab页操作刷新保存状态，路由切换之后不需要保存）
    sessionStorage.removeItem("currentTab");
    next();
  },
  methods: {
    // 根据id获取对应歌单详情数据
    getSongListDetailBy() {
      let timestamp = Date.parse(new Date());
      getSongListDetail(this.id, timestamp).then((res) => {
        // 保存歌单描述信息
        this.playlist = res.data.playlist;
        // 存储歌单中的所有歌曲id，类型为字符串
        this.playlist.trackIds.forEach((item) => {
          this.songids += item.id + ",";
        });
        let queryids = this.songids.substr(0, this.songids.length - 1);
        // 根据歌曲id获取每首歌的信息
        getEverySongDetail(queryids)
          .then((res) => {
            if (res.data.songs.length !== 0) {
              this.songs = res.data.songs;
            }
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "歌单请求失败",
              center: true,
            });
          });
      });
    },
    // 获取歌单评论
    getCommentsBy(page = 1) {
      let offset = (page - 1) * 20;
      let timestamp = Date.parse(new Date());
      getSongListComment(this.id, offset, timestamp).then((res) => {
        this.hotcomments = res.data.hotComments;
        this.comments = res.data.comments;
        this.commentCount = res.data.total;
      });
    },
    // 获取歌单收藏者
    getSongListSubscribersBy(page = 1) {
      let offset = (page - 1) * 48;
      getSongListSubscribers(this.id, offset).then((res) => {
        this.subscribers = res.data.subscribers;
        this.totalcount = res.data.total;
      });
    },
    // 事件监听
    // tabs点击事件
    tabClick(tab) {
      sessionStorage.setItem("currentTab", tab.name);
    },
    // 评论分页事件
    changePage(page) {
      this.getCommentsBy(page);
      // 返回开始位置
      let view = document.querySelector(".view");
      view.scrollTo({
        behavior: "smooth",
        top: 300,
      });
    },
    // 歌单收藏者分页事件
    handlePage(page) {
      this.getSongListSubscribersBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
    // 播放全部歌曲事件
    playAllSong() {
      this.$store.dispatch("addAllSong", this.songs);
      // 默认播放第一首歌
      getSongUrl(this.songs[0].id).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
      });
      // 保存当前歌曲详情
      this.$store.dispatch("saveSongDetail", this.songs[0]);
    },
    // 收藏和取消收藏事件
    // 先判断用户是否收藏了该歌单
    isSubSongList() {
      // 查找用户歌单是否有当前歌单
      let index = this.userSongList.findIndex((item) => {
        return item.id == this.id;
      });
      if (index == -1) {
        this.isSub = false;
      } else {
        this.isSub = true;
      }
    },
    // 点击收藏按钮的回调
    subSongListBy() {
      // 1为收藏，2为取消收藏
      let t = !this.isSub ? 1 : 2;
      // 发送收藏，取消收藏的请求
      subSongList(t, this.id).then((res) => {
        if (res.data.code == 200) {
          this.isSub = !this.isSub;
          // 清空缓存的歌单
          localStorage.removeItem("userSongList");
          // 重新获取用户歌单
          let timestamp = Date.parse(new Date());
          getUserSonglist(this.userInfo.userId, timestamp).then((res) => {
            localStorage.setItem(
              "userSongList",
              JSON.stringify(res.data.playlist)
            );
            this.$store.dispatch("saveUserSongList", res.data.playlist);
            if (t == 1) {
              this.$message({
                type: "success",
                message: "收藏成功",
                center: true,
              });
            } else {
              this.$message({
                type: "success",
                message: "取消收藏成功",
                center: true,
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>