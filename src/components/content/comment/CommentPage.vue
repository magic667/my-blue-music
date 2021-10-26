<template>
  <div class="comment">
    <!-- 输入框 -->
    <div class="textinput">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="content"
        rows="3"
        maxlength="100"
        show-word-limit
      ></el-input>
      <el-button
        round
        size="small"
        icon="el-icon-position"
        class="el-btn"
        @click="submitComment"
        >发送评论</el-button
      >
    </div>
    <!-- 评论列表 -->
    <div class="comment-list" ref="commentlist">
      <!-- 热门评论 -->
      <div class="hot-comment" v-if="hotcomments.length !== 0">
        <h3>热门评论</h3>
        <CommentItem
          v-for="(item, index) in hotcomments"
          :key="index"
          :item="item"
          @toUserDetail="toUserDetail"
        ></CommentItem>
      </div>
      <!-- 最新评论 -->
      <h3>最新评论</h3>
      <div class="new-comment">
        <CommentItem
          v-for="(item, index) in comments"
          :key="index"
          :item="item"
          @toUserDetail="toUserDetail"
        ></CommentItem>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="page" v-if="hotcomments.length !== 0 || comments.length !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="hotcomments.length + 20"
        layout="total, prev, pager, next"
        :total="commentCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { submitCommentBy } from "network/comment/comment";
import CommentItem from "./CommentItem.vue";

export default {
  name: "CommentPage",
  components: { CommentItem },
  props: {
    // 最新评论数据
    comments: {
      type: Array,
      default: () => [],
    },
    // 热门评论数据
    hotcomments: {
      type: Array,
      default: () => [],
    },
    // 评论总数量
    commentCount: {
      type: Number,
    },
    // 发表评论的类型
    // 0:歌曲 1:mv 2:歌单 3:专辑 5:视频
    commentType: {
      type: Number,
    },
    commentresId: {
      type: null,
    },
  },
  data() {
    return {
      isReload: true,
      content: "", // 评论区文本框
      currentPage: 1, // 分页器默认页数
      timer: "",
    };
  },
  updated() {
    clearInterval(this.timer);
  },
  methods: {
    // 发表评论
    submitComment() {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: "warning",
          message: "登录后才能评价",
          showClose: true,
          center: true,
        });
        return;
      }
      // 判断评论是否为空
      if (this.content == "") {
        this.$message({
          type: "warning",
          message: "评论不能为空",
          showClose: true,
          center: true,
        });
        return;
      } else {
        // 发表评论
        submitCommentBy(this.commentType, this.commentresId, this.content).then(
          (res) => {
            if (res.data.code == 200) {
              // 发布评论后，清空文本框，再重新请求评论数据
              this.content = "";
              this.$message({
                type: "success",
                message: "评论成功",
                center: true,
              });
              this.reload();
            } else {
              this.$message.error("评论失败，请稍后重试！");
            }
          }
        );
      }
    },
    // 刷新评论
    reload() {
      this.isReload = false;
      this.$emit("updateComment");
      this.$nextTick(() => {
        this.isReload = true;
      });
    },
    // 评论列表分页
    handleCurrentChange(page) {
      // 当前页码改变时触发
      this.currentPage = page;
      this.$emit("changePage", page);
    },
    // 点击用户头像
    toUserDetail() {
      // 如果在歌曲详情页点击，需要关闭歌曲详情页
      this.$emit("toUserDetail");
    },
  },
};
</script>

<style lang="less" scoped>
.comment {
  position: relative;
}

.textinput {
  text-align: right;

  .el-btn {
    margin-top: 10px;
  }
}

h3 {
  color: black;
}

.new-comment {
  margin-top: 20px;
}
</style>