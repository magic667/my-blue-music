<template>
  <div class="rank-feature">
    <div class="hd">
      <el-divider content-position="left">
        <h2>流行榜</h2>
      </el-divider>
    </div>
    <!-- 左侧图片 -->
    <div class="bd" v-for="(item, index) in rankfeature" :key="index">
      <div class="left-img" @click="rankClick(item.id)">
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <!-- 右侧歌曲列表 -->
      <div class="right-songlist">
        <el-table size="small" :data="item.tracks" stripe style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="first"
            label="歌曲"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="second"
            label="歌手"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <div class="more" @click="rankClick(item.id)">
          查看全部<span class="iconfont icon-xiayiye"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rankfeature",
  props: {
    rankfeature: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    rankClick(id) {
      this.$router.push("/songlistdetail/" + id);
    },
  },
};
</script>

<style lang="less" scoped>
.bd {
  display: flex;
  padding-bottom: 15px;

  .left-img {
    position: relative;
    width: 16%;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .right-songlist {
    width: 84%;
    padding-left: 20px;

    .more {
      padding-top: 15px;
      cursor: pointer;
    }

    &:hover {
      color: #5292fe;
    }

    .iconfont {
      font-size: 12px;
    }
  }
}
</style>