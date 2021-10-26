<template>
  <div class="tabbar">
    <div class="tab">
      <div
        class="tab-item"
        v-for="(item, index) in tabItems"
        :key="index"
        :class="{ active: currentIndex == index }"
        @click="tabItemClick(index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  props: {
    tabItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    tabItemClick(index) {
      this.currentIndex = index;
      this.$emit("tabItemClick", index);
    },
  },
};
</script>

<style lang="less" scoped>
.tabbar {
  .tab {
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    .tab-item {
      padding: 5px 25px;
      border: 1px solid #ddd;
    }

    .tab-item:first-child {
      border-right: 0;
    }
  }
}

.active {
  background-color: #7c7d85;
  color: #fff;
}
</style>