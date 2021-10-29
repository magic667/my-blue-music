<template>
  <div class="playing-list">
    <div class="top-nav">
      <TabBar :tab-items="tabitems" @tabItemClick="tabItemClick"></TabBar>
    </div>
    <!-- 播放列表 -->
    <div class="play-list" v-if="activeItem == 0">
      <div class="hd">
        <h4 style="padding: 0 20px">总{{ playingList.length }}首</h4>
        <span @click="deleteAll" style="cursor: pointer">
          <i class="iconfont icon-delete">清空</i>
        </span>
      </div>
      <div class="bd">
        <el-table
          size="mini"
          stripe
          :show-header="false"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :data="playingList"
          @row-dblclick="playSongClick"
          empty-text="暂无歌曲"
        >
          <el-table-column width="50">
            <template v-slot="scope">
              <span
                class="iconfont icon-laba"
                v-if="scope.row.id == nowSongDetail.id"
              ></span>
              <span v-else>{{ scope.row.index | formatIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="歌曲"
            :show-overflow-tooltip="true"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="ar[0].name"
            label="歌手"
            :show-overflow-tooltip="true"
            width="100"
          >
            <template v-slot="scope">
              <span class="sname" @click="toSinger(scope.row.ar[0].id)">
                {{ scope.row.ar[0].name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template v-slot="scope">
              <span>
                {{ scope.row.dt | formatDuration }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="60">
            <template v-slot="scope">
              <span
                class="iconfont icon-guanbi"
                @click="deleteSong(scope.row)"
              ></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 历史记录 -->
    <div class="history-list" v-if="activeItem == 1">
      <div class="hd">
        <h4 style="padding: 0 20px">总{{ historyPlay.length }}首</h4>
        <span style="cursor: pointer" @click="deleteAllHistory">
          <i class="iconfont icon-delete">清空</i>
        </span>
      </div>
      <div class="bd">
        <el-table
          size="mini"
          stripe
          :show-header="false"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :data="historyPlay"
          @row-dblclick="playHistorySong"
          empty-text="暂无记录"
        >
          <el-table-column width="50">
            <template v-slot="scope">
              <span
                class="iconfont icon-laba"
                v-if="scope.row.id == nowSongDetail.id"
              ></span>
              <span v-else>{{ scope.row.index | formatIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="歌曲"
            :show-overflow-tooltip="true"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="ar[0].name"
            label="歌手"
            :show-overflow-tooltip="true"
            width="100"
          >
            <template v-slot="scope">
              <span class="sname" @click="toSinger(scope.row.ar[0].id)">
                {{ scope.row.ar[0].name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template v-slot="scope">
              <span>
                {{ scope.row.dt | formatDuration }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="60">
            <template v-slot="scope">
              <span
                class="iconfont icon-guanbi"
                @click="deleteHistory(scope.row)"
              ></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSongUrl } from "network/playmusic/playmusic.js";
import TabBar from "components/common/TabBar.vue";

export default {
  name: "PlayingList",
  components: { TabBar },
  data() {
    return {
      tabitems: [{ name: "播放列表" }, { name: "历史记录" }],
      activeItem: 0,
    };
  },
  computed: {
    ...mapGetters(["playingList", "nowSongDetail", "historyPlay"]),
  },
  filters: {
    formatIndex(index) {
      if (index < 9) {
        return "0" + (index + 1);
      } else {
        return index + 1;
      }
    },
  },
  methods: {
    // 顶部tab栏切换
    tabItemClick(index) {
      this.activeItem = index;
    },
    // 双击播放列表歌曲
    playSongClick(song) {
      // 保存当前歌曲详情
      this.$store.dispatch("saveSongDetail", song);
      // 获取歌曲url
      getSongUrl(song.id).then((res) => {
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
      });
    },
    // 删除播放列表单曲
    deleteSong(song) {
      this.$store.dispatch("deleteSong", song.id);
    },
    // 清空播放列表
    deleteAll() {
      this.$store.dispatch("deleteAll");
    },
    // 点击历史记录歌曲
    playHistorySong(song) {
      // 播放歌曲
      this.playSongClick(song);
      // 添加到播放列表
      this.$store.dispatch("addPlayinglist", song);
    },
    // 清空历史记录
    deleteAllHistory() {
      this.$store.dispatch("deleteAllHistory");
    },
    // 删除历史记录单曲
    deleteHistory(song) {
      this.$store.dispatch("deleteHistory", song.id);
    },
    // 实现当前播放歌曲行高亮显示
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (row.id == this.nowSongDetail.id) {
        return "rowCurrent";
      }
    },
    // 点击歌手，跳转歌手页面
    toSinger(id) {
      this.$router.push("/singerdetail/" + id);
    },
  },
};
</script>

<style lang="less" scoped>
.playing-list {
  position: absolute;
  bottom: 70px;
  right: 0;
  height: calc(100vh - 130px);
  background-color: #fff;
  border-left: 1px solid #ebebeb;
  box-shadow: -3px 0 5px 0 #eee;
}

.top-nav {
  display: flex;
  width: 100%;
  margin-top: 10px;
  justify-content: center;
}

.hd {
  display: flex;
  height: 24px;
  padding: 10px 0;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;

  span {
    padding-right: 30px;

    .icon-delete {
      font-size: 14px;
    }
  }
}

.play-list {
  height: calc(100% - 78px);

  .bd {
    height: 100%;
    overflow-y: scroll;

    .sname {
      cursor: pointer;
    }

    .icon-guanbi {
      font-size: 12px;
    }

    &:hover {
      color: #409eff;
    }
  }

  .icon-guanbi:hover {
    color: red;
  }
}

::-webkit-scrollbar {
  width: 5px;
  height: 12px;
  background-color: #fff;
}
</style>