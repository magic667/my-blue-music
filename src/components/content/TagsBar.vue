<template>
  <div class="tags-bar">
    <ul>
      <li style="color: black; font-size: 16px">{{ taglist.category }}:</li>
      <li
        v-for="(item, index) in taglist.list"
        :key="index"
        @click="tagBarClick(index, item)"
      >
        <span :class="{ active: currentIndex == index }">{{
          item.name || item
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TagsBar",
  props: {
    taglist: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    tagBarClick(index, item) {
      this.currentIndex = index;
      this.$emit("tagBarClick", item);
    },
  },
};
</script>

<style lang="less" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  padding-top: 15px;

  li {
    padding: 3px 5px;
    cursor: pointer;

    &:hover {
      color: #5292fe;
    }

    span {
      padding: 5px 8px;
    }
  }
}

.active {
  color: #5292fe;
  background-color: rgba(100, 149, 237, 0.2);
  border-radius: 5px;
}
</style>