<template>
  <div class="songlist-res">
    <div class="result">
      <h3>
        搜索<span style="color: #5292fe">{{ this.keywords }}</span
        >,找到{{ songlistResCount }}个歌单
      </h3>
    </div>
    <SongList :song-list="songlistRes"></SongList>
    <div class="page" v-if="songlistRes.length !== 0 && songlistResCount > 30">
      <el-pagination
        background
        @current-change="changeSonglistPage"
        :page-size="30"
        layout="total, prev, pager, next"
        :total="songlistResCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchSongList } from "network/searchdetail/searchdetail";
import SongList from "components/content/songlist/SongList.vue";

export default {
  name: "SongListRes",
  components: { SongList },
  data() {
    return {
      keywords: "",
      songlistRes: [],
      songlistResCount: null,
    };
  },
  created() {
    // 保存搜索关键字
    this.keywords = this.$route.params.keywords;
    this.getSearchSongListBy();
  },
  methods: {
    // 获取搜索歌单
    getSearchSongListBy(page = 1) {
      let offset = (page - 1) * 30;
      getSearchSongList(this.keywords, offset).then((res) => {
        this.songlistRes = res.data.result.playlists;
        this.songlistResCount = res.data.result.playlistCount;
      });
    },
    // 分页事件
    changeSonglistPage(page) {
      this.getSearchSongListBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  padding: 10px 0px 15px;
}
</style>