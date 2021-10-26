<template>
  <div class="video-detail w">
    <div class="left-detail">
      <h2 style="padding-bottom: 15px" v-if="$route.params.type == 'mv'">
        MV详情
      </h2>
      <h2 style="padding-bottom: 15px" v-else>视频详情</h2>
      <!-- 视频播放器 -->
      <div class="video-play">
        <video
          :src="mvUrl || videoUrl"
          controls="controls"
          autoplay="autoplay"
          loop="loop"
        ></video>
      </div>
      <!-- 视频信息 -->
      <Videoinfo
        :videoinfo="videoinfo"
        :type="$route.params.type"
        :is-sub="isSub"
        :islike="islike"
        @subMvBy="subMvBy"
        @likeVideoBy="likeVideoBy"
      ></Videoinfo>
      <!-- 视频评论 -->
      <div class="video-comment" ref="comment">
        <h3 style="padding-bottom: 5px">评论({{ commentCount }})</h3>
        <CommentPage
          :comments="comments"
          :hotcomments="hotcomments"
          :comment-count="commentCount"
          :comment-type="commentType"
          :commentres-id="id"
          @updateComment="updateComment"
          @changePage="changePage"
        ></CommentPage>
      </div>
    </div>
    <!-- 右侧相关视频推荐 -->
    <div class="right-recvideo">
      <Similar :similar="similarvideo" :type="$route.params.type"></Similar>
    </div>
  </div>
</template>

<script>
import {
  /* MV */
  getMvDetail,
  getMvComment,
  getSimiMv,
  getMvUrl,
  subMv,
  /* 视频 */
  getVideoDetail,
  getVideoComment,
  getSimiVideo,
  getVideoUrl,
  subVideo,
  getLikeVideo,
  likeVideo,
} from "network/recvideo/recvideo";
import { getSubMv } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import Videoinfo from "./Childcomps/Videoinfo.vue";
import CommentPage from "components/content/comment/CommentPage.vue";
import Similar from "./Childcomps/Similar.vue";

export default {
  inject: ["reload"],
  name: "VideoDetail",
  components: { Videoinfo, CommentPage, Similar },
  data() {
    return {
      id: "",
      type: "",
      videoinfo: {}, //视频信息
      comments: [], //评论
      hotcomments: [], //热门评论
      commentCount: null, //评论数量
      similarvideo: [], //相似视频
      mvUrl: "",
      videoUrl: "",
      commentType: Number, //评论类型
      isSub: false, //是否收藏了该视频
      likeVideoList: [], //点赞了的视频列表
      islike: false, //是否点赞了视频
    };
  },
  computed: {
    ...mapGetters(["subMvlist"]),
  },
  watch: {
    // 点击相关推荐视频
    // 路由push相同地址不同参数时，不会自动刷新页面
    // 通过watch监听路由变化，发生变化时，进行reload刷新
    $route(to, from) {
      if (to !== from) {
        this.reload();
      }
    },
  },
  created() {
    // 保存路由传过来的id，视频类型
    this.id = this.$route.params.id;
    this.type = this.$route.params.type;
    if (this.type == "mv") {
      // 评论类型是MV
      this.commentType = 1;
      this.getMvDetailBy();
      this.getSimiMvBy();
      this.getMvUrlBy();
      this.getMvCommentBy();
    } else if (this.type == "video") {
      // 评论类型是视频
      this.commentType = 5;
      this.getVideoDetailBy();
      this.getSimiVideoBy();
      this.getVideoUrlBy();
      this.getVideoCommentBy();
    }
    // 获取收藏的MV，视频列表
    if (this.subMvlist.length == 0) {
      this.getSubMvBy();
    }
    // 判断是否收藏了当前MV，视频
    this.isSubMv();
    this.getLikeVideoBy();
  },
  methods: {
    // 获取MV详情
    getMvDetailBy() {
      getMvDetail(this.id).then((res) => {
        this.videoinfo = res.data.data;
      });
    },
    // 获取相似MV
    getSimiMvBy() {
      getSimiMv(this.id).then((res) => {
        this.similarvideo = res.data.mvs;
      });
    },
    // 获取MV播放地址
    getMvUrlBy() {
      getMvUrl(this.id).then((res) => {
        this.mvUrl = res.data.data.url;
      });
    },
    // 获取MV评论
    getMvCommentBy(page = 1) {
      let offset = (page - 1) * 20;
      // 定义时间戳，每次获取最新的评论数据
      let timestamp = Date.parse(new Date());
      getMvComment(this.id, offset, timestamp).then((res) => {
        this.hotcomments = res.data.hotComments;
        this.comments = res.data.comments;
        this.commentCount = res.data.total;
      });
    },
    // 获取视频详情数据
    getVideoDetailBy() {
      getVideoDetail(this.id).then((res) => {
        this.videoinfo = res.data.data;
      });
    },
    // 获取相关视频
    getSimiVideoBy() {
      getSimiVideo(this.id).then((res) => {
        this.similarvideo = res.data.data;
      });
    },
    // 获取视频播放地址
    getVideoUrlBy() {
      getVideoUrl(this.id).then((res) => {
        this.videoUrl = res.data.urls[0].url;
      });
    },
    // 获取视频评论
    getVideoCommentBy(page = 1) {
      let offset = (page - 1) * 20;
      // 定义时间戳，每次获取最新的评论数据
      let timestamp = Date.parse(new Date());
      getVideoComment(this.id, offset, timestamp).then((res) => {
        this.hotcomments = res.data.hotComments;
        this.comments = res.data.comments;
        this.commentCount = res.data.total;
      });
    },
    // 事件监听
    // 评论分页事件
    changePage(page) {
      // 返回评论开始位置
      let view = document.querySelector(".view");
      view.scrollTo({
        behavior: "smooth",
        top: this.$refs.comment.offsetTop,
      });
      if (this.type == "mv") {
        this.getMvCommentBy(page);
      } else if (this.type == "video") {
        this.getVideoCommentBy(page);
      }
    },
    // 发送评论，更新评论数据
    updateComment() {
      if (this.type == "mv") {
        this.getMvCommentBy();
      } else if (this.type == "video") {
        this.getVideoCommentBy();
      }
    },
    // 收藏视频或MV事件
    // 获取收藏的视频
    getSubMvBy() {
      let timestamp = Date.parse(new Date());
      getSubMv(timestamp).then((res) => {
        this.$store.dispatch("saveFavoriteMv", res.data.data);
      });
      this.isSubMv();
    },
    // 判断是否收藏了当前视频
    isSubMv() {
      let index = this.subMvlist.findIndex((item) => {
        return item.vid == this.id;
      });
      if (index == -1) {
        this.isSub = false;
      } else {
        this.isSub = true;
      }
    },
    // 点击收藏按钮的回调
    subMvBy() {
      // 1为收藏，其他为取消收藏
      let t = !this.isSub ? 1 : 2;
      if (this.type == "mv") {
        subMv(t, this.id).then((res) => {
          if (res.data.code == 200) {
            this.getSubMvBy();
          }
        });
      } else {
        subVideo(t, this.id).then((res) => {
          if (res.data.code == 200) {
            this.getSubMvBy();
          }
        });
      }
    },
    // 点赞视频
    // 获取点赞的视频
    getLikeVideoBy() {
      let timestamp = Date.parse(new Date());
      getLikeVideo(timestamp).then((res) => {
        this.likeVideoList = res.data.data.feeds;
        // 判断当前视频是否在点赞的视频里
        // 视频id和获取的喜欢视频id不一样，用发布时间和播放量判断
        let index = this.likeVideoList.findIndex((item) => {
          return (
            item.mlogBaseData.id == this.id ||
            (item.mlogBaseData.pubTime == this.videoinfo.publishTime &&
              item.mlogExtVo.playCount == this.videoinfo.playTime)
          );
        });
        if (index == -1) {
          this.islike = false;
        } else {
          this.islike = true;
        }
      });
    },
    // 点击点赞按钮的回调
    likeVideoBy() {
      // 1为收藏，其他为取消点赞
      let t = !this.islike ? 1 : 2;
      if (this.type == "mv") {
        let type = 1;
        likeVideo(t, type, this.id).then((res) => {
          this.getLikeVideoBy();
        });
      } else {
        let type = 5;
        likeVideo(t, type, this.id).then((res) => {
          this.getLikeVideoBy();
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.video-detail {
  display: flex;
  justify-content: space-between;

  .left-detail {
    position: relative;
    width: 60%;

    .video-play {
      video {
        width: 100%;
        height: 400px;
      }
    }

    .video-comment {
      padding-top: 20px;
    }
  }

  .right-recvideo {
    width: 35%;
  }
}
</style>