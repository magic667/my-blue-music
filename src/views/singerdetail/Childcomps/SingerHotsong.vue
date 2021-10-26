<template>
  <div class="hot-song">
    <SongTable :songs="hotsong"></SongTable>
  </div>
</template>

<script>
import SongTable from "components/content/SongTable.vue";

export default {
  name: "SingerHotsong",
  components: { SongTable },
  props: {
    hotsong: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style>
</style>