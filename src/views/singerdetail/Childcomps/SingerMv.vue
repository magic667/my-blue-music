<template>
  <div class="singer-mv">
    <div class="mv-list">
      <VideoList :video-list="mvlist"></VideoList>
    </div>
    <!-- 分页器 -->
  </div>
</template>

<script>
import VideoList from "components/content/videolist/VideoList.vue";

export default {
  name: "SingerMv",
  components: { VideoList },
  props: {
    mvlist: {
      type: Array,
      default: () => [],
    },
    mvsize: Number,
  },
  methods: {
    handleCurrentChange(page) {
      this.$emit("changeMvPage", page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style lang="less" scoped>
.mv-list {
  padding-top: 10px;
}
</style>