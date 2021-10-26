<template>
  <div class="comment-item">
    <div class="base-info">
      <!-- 头像 -->
      <div class="avatar" @click="toUserDetail(item.user.userId)">
        <img :src="item.user.avatarUrl" alt="" />
      </div>
      <!-- 右侧内容 -->
      <div class="right-info">
        <span class="nickname" @click="toUserDetail(item.user.userId)">
          {{ item.user.nickname }}
        </span>
        <!-- 评论时间 -->
        <div class="comment-time">
          <p>{{ item.time | showDate }}</p>
        </div>
        <p class="comment-content">{{ item.content }}</p>
        <!-- 内部回复评论 -->
        <div class="be-replied" v-if="item.beReplied.length !== 0">
          <div v-for="(item2, index2) in item.beReplied" :key="index2">
            <p>
              <span class="be-nickname" @click="toUserDetail(item.user.userId)"
                >{{ item2.user.nickname }}：</span
              >{{ item2.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 点赞评论 -->
    <div class="like">
      <span class="iconfont icon-dianzan">{{ item.likedCount }}</span>
      <span class="iconfont icon-comment"></span>
    </div>
  </div>
</template>

<script>
import { formatDate } from "common/formatDate";
export default {
  name: "CommentItem",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  filters: {
    // 格式化日期
    showDate(value) {
      const date = new Date(value);
      return formatDate(date, "yyyy-MM-dd   hh:mm:ss");
    },
  },
  methods: {
    // 点击用户头像
    toUserDetail(uid) {
      this.$router.push("/userdetail/" + uid);
      // 如果在歌曲详情页点击 需要关闭歌曲详情页
      this.$emit("toUserDetail");
    },
  },
};
</script>

<style lang="less" scoped>
.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  .base-info {
    display: flex;
    justify-content: left;

    .avatar {
      width: 6%;

      img {
        width: 100%;
        border-radius: 50%;
      }
    }

    .right-info {
      width: 94%;
      padding-left: 15px;

      .nickname {
        font-size: 14px;
        font-weight: 700;
        color: #3f3e3e9f;
        cursor: pointer;
      }

      .comment-content {
        padding-top: 10px;
        font-size: 13px;
      }

      .content {
        padding-top: 10px;

        span {
          color: royalblue;
          cursor: pointer;
        }
      }

      .be-replied {
        padding: 20px 10px;
        margin: 15px 0;
        background-color: #eee;

        .be-nickname {
          font-weight: 700;
          color: #3f3e3e9f;
        }

        span {
          border-color: royalblue;
          cursor: pointer;
        }
      }

      .comment-time {
        color: #3f3e3e9f;
      }
      p {
        font-size: 12px;
      }
    }
  }

  .like {
    padding-right: 20px;
    text-align: right;

    span {
      padding-right: 15px;
    }
  }
}
</style>