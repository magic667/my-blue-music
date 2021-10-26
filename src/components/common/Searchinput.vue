<template>
  <div class="search-input">
    <!-- 输入框 -->
    <el-input
      placeholder="请输入内容"
      size="small"
      v-model="searchWord"
      v-popover:popover
      slot="reference"
      @keyup.enter.native="search"
    >
      <span slot="suffix" class="el-icon-search" @click="search"></span>
    </el-input>
    <!-- 弹出框 -->
    <el-popover
      ref="popover"
      placement="bottom"
      title="热搜榜"
      width="350"
      trigger="focus"
    >
      <div class="hot-search-rank">
        <ul>
          <li
            v-for="(item, index) in searchList"
            :key="index"
            @click="addHotWord(item.searchWord)"
          >
            <div class="num" :class="index < 3 ? 'hotword-num' : ''">
              {{ index + 1 }}
            </div>
            <div class="main-content">
              <div class="word">
                <span :class="index < 3 ? 'hotword' : ''">
                  {{ item.searchWord }}
                </span>
                <span class="by">{{ item.score }}</span>
                <span class="icon" v-if="item.iconUrl">
                  <img :src="item.iconUrl" alt="" />
                </span>
              </div>
              <p class="by">{{ item.content }}</p>
            </div>
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { getSearchHotWord } from "network/searchdetail/searchdetail";

export default {
  data() {
    return {
      searchWord: "",
      searchList: "",
    };
  },
  created() {
    getSearchHotWord().then((res) => {
      this.searchList = res.data.data;
    });
  },
  methods: {
    search() {
      if (this.searchWord == "") {
        this.$message({
          showClose: true,
          message: "请输入内容",
          type: "warning",
          center: true,
        });
      } else {
        this.$router
          .push("/searchdetail/" + this.searchWord)
          .catch((err) => err);
        this.$refs.popover.doClose();
      }
    },
    // 热搜榜添加
    addHotWord(word) {
      this.$refs.popover.doClose();
      this.searchWord = word;
      this.$router.push("/searchdetail/" + this.searchWord).catch((err) => err);
    },
  },
};
</script>

<style lang="less" scoped>
.search-input {
  position: relative;
  display: flex;
  align-items: center;

  .el-icon-search {
    padding-top: 10px;
    cursor: pointer;

    &:hover {
      font-weight: 700;
      color: royalblue;
    }
  }
}

.hot-search-rank {
  padding: 0;
  cursor: pointer;

  li {
    display: flex;
    align-items: center;
    padding: 10px 0;

    .num {
      width: 40px;
      padding-right: 20px;
    }
  }

  .hotword-num {
    font-weight: 700;
    color: red;
  }

  .main-content {
    .word {
      span {
        padding-right: 10px;
      }

      .icon {
        display: inline-block;
        width: 30px;
        height: 20px;

        img {
          width: 100%;
        }
      }
    }

    p {
      padding-top: 5px;
    }

    .hotword {
      font-weight: 700;
      color: black;
    }
  }

  li:hover {
    background: rgba(220, 220, 220, 0.4);
  }
}
</style>