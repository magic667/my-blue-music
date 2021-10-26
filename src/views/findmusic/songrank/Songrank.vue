<template>
  <div id="song-rank" class="w" v-if="allRankInfo.length !== 0">
    <Rankfeature :rankfeature="rankfeature"></Rankfeature>
    <Rankglobal :rankglobal="rankglobal"></Rankglobal>
  </div>
</template>

<script>
import { getAllRankInfo } from "network/findmusic/songrank/songrank";
import Rankfeature from "./Childcomps/Rankfeature.vue";
import Rankglobal from "./Childcomps/Rankglobal.vue";

export default {
  name: "Songrank",
  components: { Rankfeature, Rankglobal },
  data() {
    return {
      allRankInfo: [],
      rankfeature: [],
      rankglobal: [],
    };
  },
  created() {
    getAllRankInfo().then((res) => {
      this.allRankInfo = res.data.list;
      // 榜单数据分为两个数组
      this.rankfeature = this.allRankInfo.slice(0, 4);
      this.rankglobal = this.allRankInfo.slice(4, this.allRankInfo.length);
    });
  },
};
</script>

<style>
</style>