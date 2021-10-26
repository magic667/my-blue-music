<template>
  <div class="user-list-item" @click="toUserDetail">
    <div class="left-avatar">
      <img v-lazy="userListItem.avatarUrl" />
    </div>
    <div class="right-uname">
      <p class="uname">{{ userListItem.nickname }}</p>
      <p class="by">
        {{ userListItem.signature == "" ? "" : userListItem.signature }}
      </p>
      <p class="info" v-if="userListItem.playlistCount">
        <span>歌单：{{ userListItem.playlistCount }}</span>
        <span>粉丝：{{ userListItem.followeds }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserListItem",
  props: {
    userListItem: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    toUserDetail() {
      this.$router.push("/userdetail/" + this.userListItem.userId);
    },
  },
};
</script>

<style lang="less" scoped>
.user-list-item {
  display: flex;
  width: 24%;
  align-items: center;
  padding: 10px 5px;
  cursor: pointer;

  &:hover {
    background: rgba(236, 245, 255, 0.5);
    border-radius: 5px;
  }

  .left-avatar {
    width: 25%;

    img {
      width: 100%;
      border-radius: 50%;
    }
  }

  .right-uname {
    width: 75%;
    padding-left: 10px;
  }

  p {
    padding: 3px 0;

    span {
      padding-right: 5px;
    }
  }

  .by {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>