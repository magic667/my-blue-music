<template>
  <div id="singer-detail" class="w">
    <!-- 歌手基本信息 -->
    <SingerInfo
      :singer-info="singerInfo"
      :is-sub="isSub"
      @subSingerBy="subSingerBy"
    ></SingerInfo>
    <!-- 歌手作品信息 -->
    <div class="singer-works">
      <el-tabs>
        <!-- 专辑列表 -->
        <el-tab-pane label="专辑">
          <!-- 专辑内容 -->
          <SingerAlbum :albumlist="albumlist"></SingerAlbum>
          <!-- 分页器 -->
          <div
            class="page"
            v-if="
              singerInfo.albumSize > 30 && singerInfo.albumSize.length !== 0
            "
          >
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="30"
              layout="total, prev, pager, next"
              :total="singerInfo.albumSize"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 热门50首 -->
        <el-tab-pane label="热门歌曲">
          <SingerHotsong :hotsong="hotsong"></SingerHotsong>
        </el-tab-pane>
        <!-- MV列表 -->
        <el-tab-pane label="MV">
          <SingerMv
            :mvlist="mvlist"
            :mvsize="singerInfo.mvSize"
            @changeMvPage="changeMvPage"
            v-if="mvlist.length !== 0"
          ></SingerMv>
          <div class="no" v-else>暂无MV</div>
        </el-tab-pane>
        <!-- 歌手详情 -->
        <el-tab-pane label="歌手详情">
          <div class="singer-desc" v-if="singerInfo.briefDesc">
            <p>{{ singerInfo.briefDesc }}</p>
          </div>
          <div class="no" v-else>暂无歌手详情</div>
        </el-tab-pane>
        <!-- 相似歌手 -->
        <el-tab-pane label="相似歌手">
          <SingerSimilar
            :similarlist="similarlist"
            v-if="similarlist.length !== 0"
          ></SingerSimilar>
          <div class="no" v-else>暂无相似歌手</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getSingerDetail,
  getSingerHotSong,
  getSingerAlbum,
  getSingerMv,
  getSingerSimilar,
  subSinger,
} from "network/singerdetail/singerdetail";
import { getSubSinger } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import SingerInfo from "./Childcomps/SingerInfo.vue";
import SingerAlbum from "./Childcomps/SingerAlbum.vue";
import SingerHotsong from "./Childcomps/SingerHotsong.vue";
import SingerMv from "./Childcomps/SingerMv.vue";
import SingerSimilar from "./Childcomps/SingerSimilar.vue";

export default {
  inject: ["reload"],
  name: "Singerdetail",
  components: {
    SingerInfo,
    SingerAlbum,
    SingerHotsong,
    SingerMv,
    SingerSimilar,
  },
  data() {
    return {
      id: "", // 歌手id
      singerInfo: {}, // 歌手基本信息
      singerHomeId: {},
      hotsong: [], // 歌手热门歌曲
      albumlist: [], // 歌手专辑列表
      mvlist: [], //歌手mv列表
      similarlist: [], // 相似歌手
      isSub: false, // 是否收藏了当前歌手
    };
  },
  computed: {
    ...mapGetters(["subSingerlist"]),
  },
  watch: {
    // 局部刷新页面
    $route(to, from) {
      if (to !== from) {
        this.reload();
      }
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.getSingerDetailBy();
    this.getSingerHotSongBy();
    this.getSingerAlbumBy();
    this.getSingerMvBy();
    this.getSingerSimilarBy();
    // 获取用户收藏的歌手
    this.getUserSubSinger();
    // 判断是否收藏了当前歌手
    this.isSubSinger();
  },
  methods: {
    // 根据歌手id获取歌手信息
    getSingerDetailBy() {
      getSingerDetail(this.id).then((res) => {
        // 判断是否有用户id，保存用户id
        if (res.data.data.user) {
          res.data.data.artist.userId = res.data.data.user.userId;
          this.singerInfo = res.data.data.artist;
        } else {
          this.singerInfo = res.data.data.artist;
        }
      });
    },
    // 获取歌手热门歌曲50首
    getSingerHotSongBy() {
      getSingerHotSong(this.id).then((res) => {
        this.hotsong = res.data.hotSongs;
      });
    },
    // 获取歌手专辑
    getSingerAlbumBy(page = 1) {
      let offset = (page - 1) * 30;
      getSingerAlbum(this.id, offset).then((res) => {
        this.albumlist = res.data.hotAlbums;
      });
    },
    // 获取歌手MV
    getSingerMvBy(page = 1) {
      let offset = (page - 1) * 30;
      getSingerMv(this.id, offset).then((res) => {
        this.mvlist = res.data.mvs;
      });
    },
    // 获取相似歌手
    getSingerSimilarBy() {
      getSingerSimilar(this.id).then((res) => {
        this.similarlist = res.data.artists;
      });
    },
    // 事件监听
    // 专辑分页事件
    handleCurrentChange(page) {
      this.getSingerAlbumBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
    // MV分页
    changeMvPage(page) {
      this.getSingerMvBy(page);
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
    // 收藏当前歌手事件
    // 获取用户收藏的歌手
    getUserSubSinger() {
      let timestamp = Date.parse(new Date());
      getSubSinger(timestamp).then((res) => {
        this.$store.dispatch("saveFavoriteSinger", res.data.data);
        this.isSubSinger();
      });
    },
    // 判断是否收藏了当前歌手
    isSubSinger() {
      let index = this.subSingerlist.findIndex((item) => {
        return item.id == this.id;
      });
      if (index == -1) {
        this.isSub = false;
      } else {
        this.isSub = true;
      }
    },
    // 点击收藏按钮
    subSingerBy() {
      // 1为收藏，其他为取消收藏
      let t = !this.isSub ? 1 : 2;
      subSinger(t, this.id).then((res) => {
        if (res.data.code == 200) {
          // 重新获取收藏的歌手
          this.getUserSubSinger();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.singer-desc {
  text-indent: 28px;
  line-height: 28px;
}

.no {
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}
</style>