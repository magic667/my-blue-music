<template>
  <div class="user-list">
    <UserListItem
      v-for="(item, index) in userlist"
      :key="index"
      :user-list-item="item"
    ></UserListItem>
  </div>
</template>

<script>
import UserListItem from "./UserListItem.vue";
export default {
  name: "UserList",
  components: { UserListItem },
  props: {
    userlist: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
.user-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>