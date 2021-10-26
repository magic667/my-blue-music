<template>
  <div class="top-nav">
    <el-menu :default-active="$route.path" router mode="horizontal">
      <el-menu-item
        v-for="(item, index) in tabitem"
        :key="index"
        :index="item.path"
      >
        {{ item.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "TopNav",
  props: {
    tabitem: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultActive: "",
    };
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border: 0;
}
.el-menu-item {
  color: #303133;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #5292fe;
  font-size: 18px;
  color: #5292fe;
}
</style>