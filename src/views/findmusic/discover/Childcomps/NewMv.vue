<template>
  <div class="newmv" v-if="newmv.length !== 0">
    <div class="hd">
      <el-divider content-position="left">
        <h2>最新MV</h2>
      </el-divider>
    </div>
    <div class="bd">
      <VideoList :video-list="newmv"></VideoList>
    </div>
  </div>
</template>

<script>
import VideoList from "components/content/videolist/VideoList.vue";
export default {
  name: "Newmv",
  components: { VideoList },
  props: {
    newmv: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    videoItemClick(id) {
      this.$router.push("/videolistdetail/" + id);
    },
  },
};
</script>

<style>
</style>