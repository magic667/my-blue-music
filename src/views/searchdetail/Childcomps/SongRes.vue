<template>
  <div class="song-res">
    <div class="result">
      <h3>
        搜索<span style="color: #5292fe">{{ this.keywords }}</span
        >,找到{{ songResCount }}首单曲
      </h3>
      <div
        class="match"
        v-if="
          Object.keys(matchSinger).length !== 0 ||
          Object.keys(matchAlbum).length !== 0
        "
      >
        <h3>最佳匹配</h3>
        <div class="good-match">
          <div
            class="match-item"
            @click="goSingerdetail"
            v-if="Object.keys(matchSinger).length !== 0"
          >
            <div class="cover">
              <img v-lazy="matchSinger.img1v1Url" />
            </div>
            <div class="iname">
              <span>歌手：{{ matchSinger.name }}</span>
              <span class="iconfont icon-xiayiye"></span>
            </div>
          </div>
          <div
            class="match-item"
            @click="goAlbumdetail"
            v-if="Object.keys(matchAlbum).length !== 0"
          >
            <div class="cover">
              <img v-lazy="matchAlbum.picUrl" />
            </div>
            <div class="iname">
              <span>专辑：{{ matchAlbum.name }}</span>
              <span class="iconfont icon-xiayiye"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SongTable :songs="songRes"></SongTable>
    <!-- 分页器 -->
    <div class="page" v-if="songRes.length !== 0 && songResCount > 50">
      <el-pagination
        background
        @current-change="changeSongPage"
        :page-size="50"
        layout="total, prev, pager, next"
        :total="songResCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchSong, getGoodMatch } from "network/searchdetail/searchdetail";
import SongTable from "components/content/SongTable.vue";

export default {
  name: "SongRes",
  components: { SongTable },
  data() {
    return {
      keywords: "",
      songRes: [], // 单曲
      songResCount: null,
      matchSinger: {}, // 最佳匹配歌手
      matchAlbum: {}, // 最佳匹配专辑
    };
  },
  created() {
    // 保存搜索关键字
    this.keywords = this.$route.params.keywords;
    this.getSearchSongBy();
    this.getGoodMatchBy();
  },
  methods: {
    // 获取搜索歌曲列表
    getSearchSongBy(page = 1) {
      let offset = (page - 1) * 50;
      getSearchSong(this.keywords, offset).then((res) => {
        this.songRes = res.data.result.songs;
        this.songResCount = res.data.result.songCount;
      });
    },
    // 获取最佳匹配结果
    getGoodMatchBy() {
      getGoodMatch(this.keywords).then((res) => {
        if (res.data.result.artist && res.data.result.album) {
          this.matchSinger = res.data.result.artist[0];
          this.matchAlbum = res.data.result.album[0];
        }
      });
    },
    // 事件监听
    // 分页事件
    changeSongPage(page) {
      this.getSearchSongBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
    // 最佳匹配事件
    goSingerdetail() {
      this.$router.push("/singerdetail" + this.matchSinger.id);
    },
    goAlbumdetail() {
      this.$router.push("/albumdetail" + this.matchAlbum.id);
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  padding: 10px 15px;

  h3 {
    padding-bottom: 10px;
  }

  .match {
    .good-match {
      display: flex;
      padding: 5px 0;
      cursor: pointer;

      .match-item {
        display: flex;
        width: 20%;
        align-items: center;
        margin-right: 20px;
        border: 1px solid #ddd;

        &:hover {
          font-weight: 700;
        }
      }

      .cover {
        flex: 1;

        img {
          width: 100%;
        }
      }

      .iname {
        flex: 2;
        display: flex;
        height: 100%;
        padding: 0 5px;
        justify-content: space-between;
        align-items: center;
        background-color: #f5f5f5;
      }
    }
  }
}
</style>