<template>
  <div class="similar-list">
    <Singerlist :singerlist="similarlist"></Singerlist>
  </div>
</template>

<script>
import Singerlist from "components/content/singerlist/Singerlist.vue";

export default {
  name: "SingerSimilar",
  components: { Singerlist },
  props: {
    similarlist: {
      type: Array,
      default: () => [],
    },
  },
  methods: {},
};
</script>

<style>
</style>