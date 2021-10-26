<template>
  <div class="song-table">
    <el-table
      stripe
      style="width: 100%"
      :data="songs"
      empty-text="数据加载中"
      :row-class-name="tableRowClassName"
      @row-dblclick="dbSongClick"
      @cell-mouse-enter="showOP"
      @cell-mouse-leave="closeOP"
    >
      <el-table-column width="80">
        <template v-slot="scope">
          <span
            class="iconfont icon-laba"
            v-if="scope.row.id == nowSongDetail.id"
          ></span>
          <span v-else>{{ scope.row.index | formatIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column width="40">
        <template v-slot="scope">
          <img
            class="my-heart"
            src="~assets/imgs/red-love.png"
            v-if="likeSongIds2.includes(scope.row.id)"
          />
          <img class="my-heart" src="~assets/imgs/love.png" v-else />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌曲"
        width="300"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <span
            >{{ scope.row.name }}
            <i class="iconfont icon-vip1" v-if="scope.row.fee == 1"></i>
            <i
              class="iconfont icon-mv"
              v-if="scope.row.mv != 0"
              @click="toMvDetail(scope.row.mv)"
            ></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template v-slot="scope">
          <div
            class="operation"
            v-show="isShow && currentIndex == scope.row.index"
          >
            <span
              class="iconfont icon-xihuan"
              @click="likeSong(scope.row)"
            ></span>
            <span class="el-icon-plus" @click="addSong(scope.row)"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="al.name"
        label="专辑"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <span class="sthover" @click="toAlbum(scope.row.al.id)">
            {{ scope.row.al.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ar[0].name"
        label="歌手"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <span class="sthover" @click="toSinger(scope.row.ar[0].id)">
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
    </el-table>
  </div>
</template>

<script>
import {
  getSongUrl,
  checkMusic,
  likeNowSong,
  getLikeSongList,
} from "network/playmusic/playmusic.js";
import { mapGetters } from "vuex";

export default {
  name: "SongTable",
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      likeType: null, // 是否为喜欢的音乐
      isShow: false,
      likeSongIds: [],
      likeSongIds2: [], // 用于判断喜欢图标变化
      currentIndex: null,
    };
  },
  computed: {
    ...mapGetters(["nowSongDetail", "userInfo"]),
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
  created() {
    let timestamp = Date.parse(new Date());
    if (this.userInfo) {
      getLikeSongList(this.userInfo.userId, timestamp).then((res) => {
        this.likeSongIds2 = res.data.ids;
      });
    }
  },
  methods: {
    showOP(row) {
      this.currentIndex = row.index;
      this.isShow = true;
    },
    closeOP() {
      this.isShow = false;
    },
    // 每行歌曲双击事件
    dbSongClick(song) {
      // 先检查歌曲是否可用
      checkMusic(song.id)
        .then((res) => {
          // 获取歌曲url
          getSongUrl(song.id).then((res) => {
            this.$store.dispatch("saveSongUrl", res.data.data[0].url);
          });
          // 保存当前歌曲详情
          this.$store.dispatch("saveSongDetail", song);
          // 添加到播放列表
          this.$store.dispatch("addPlayinglist", song);
        })
        .catch((err) => {
          this.$message({
            type: "warning",
            message: "暂无版权",
            center: true,
          });
        });
    },
    // 点击喜欢按钮事件
    likeSong(song) {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: "warning",
          message: "登录后才能收藏",
          showClose: true,
          center: true,
        });
        return;
      }
      let timestamp = Date.parse(new Date());
      getLikeSongList(this.userInfo.userId, timestamp).then((res) => {
        this.likeSongIds = res.data.ids;
        // 判断当前歌曲是否在用户喜欢列表
        let index = this.likeSongIds.findIndex((item) => {
          return item == song.id;
        });
        if (index == -1) {
          this.likeType = true;
        } else {
          this.likeType = false;
        }
        // 喜欢/不喜欢歌曲的请求
        likeNowSong(song.id, this.likeType).then((res) => {
          if (this.likeType == true) {
            this.$message({
              type: "success",
              message: "已添加到我喜欢的音乐",
              center: true,
            });
          } else {
            this.$message({
              type: "warning",
              message: "取消喜欢成功",
              center: true,
            });
          }
          // this.reloading();
        });
      });
    },
    // 局部刷新，取消收藏时刷新数据
    reloading() {
      this.$emit("reloading");
    },
    // 点击添加按钮
    addSong(song) {
      // 添加到播放列表
      this.$store.dispatch("addPlayinglist", song);
      this.$message({
        type: "success",
        message: "已添加到播放列表",
        center: true,
      });
    },
    // 点击歌手，跳转歌手页面
    toSinger(id) {
      this.$router.push("/singerdetail/" + id);
    },
    // 点击专辑，跳转专辑页面
    toAlbum(id) {
      this.$router.push("/albumdetail/" + id);
    },
    // 点击MV，跳转MV页面
    toMvDetail(id) {
      this.$router.push({
        name: "VideoDetail",
        params: { id, type: "mv" },
      });
    },
    // 实现当前播放歌曲行高亮
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (row.id == this.nowSongDetail.id) {
        return "rowCurrent";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.my-heart {
  width: 20px;
  height: 20px;
  cursor: default;
}

.icon-xihuan,
.el-icon-plus {
  padding-right: 15px;
  font-size: 16px;
  font-weight: 700;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

.like {
  background-color: #409eff;
}

.icon-mv {
  padding-left: 5px;
  font-size: 18px;
  color: #409eff;
  cursor: pointer;
}

.icon-vip1 {
  padding-left: 5px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
}

.sthover:hover {
  display: inline-block;
  width: 100%;
  color: #409eff;
  cursor: pointer;
}
</style>