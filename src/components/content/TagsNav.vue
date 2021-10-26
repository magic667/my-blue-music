<template>
  <div class="tags-nav" v-if="allTag.length !== 0 || hotTag.length !== 0">
    <!-- 标签 -->
    <div class="tags">
      <!-- 全部标签 -->
      <div class="all" @click="showAllTag">
        <span>{{ tagTitle }} <i class="el-icon-arrow-down"></i></span>
      </div>
      <transition name="el-fade-in">
        <div class="all-tag" v-show="isShow" @click="showAllTag">
          <div
            class="all-tag-item"
            v-for="(item, index) in allTag"
            :key="index"
            @click="tagClickA(item.name, index, item.id)"
          >
            <span :class="{ activeAll: currentIndexA == index }">
              {{ item.name }}
            </span>
          </div>
        </div>
      </transition>
      <!-- 热门标签 -->
      <div class="hot-tag">
        <div
          class="hot-tag-item"
          :class="{ activeHot: currentIndexH == index }"
          v-for="(item, index) in hotTag"
          :key="index"
          @click="tagClickH(item.name, index, item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagsNav",
  props: {
    allTag: {
      type: Array,
      default: () => {},
    },
    hotTag: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      isShow: false, // 控制选项卡显示
      tagTitle: "全部分类",
      currentIndexA: null, // 用于所有标签和热门标签联动
      currentIndexH: 0, // 用于所有标签和热门标签联动
    };
  },
  methods: {
    showAllTag() {
      this.isShow = !this.isShow;
    },
    // 全部标签点击事件
    tagClickA(tagNameA, index, id) {
      // 点击后绑定样式
      this.currentIndexA = index;
      // 根据当前标签名或id，重新获取数据
      this.$emit("tagClick", tagNameA, id);
      // 热门和全部标签联动
      let indexH = this.hotTag.findIndex((item) => {
        return item.name == tagNameA;
      });
      this.currentIndexH = indexH;
      this.tagTitle = tagNameA;
    },
    // 热门标签点击事件
    tagClickH(tagNameH, index, id) {
      this.currentIndexH = index;
      this.$emit("tagClick", tagNameH, id);
      // 热门和全部标签联动
      let indexA = this.allTag.findIndex((item) => {
        return item.name == tagNameH;
      });
      if (indexA == -1) {
        this.currentIndexA = null;
      } else {
        this.currentIndexA = indexA;
        this.tagTitle = tagNameH;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tags {
  position: relative;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  span:hover {
    color: #5292fe;
  }

  .hot-tag {
    display: flex;
    width: 70%;
    justify-content: space-between;

    .hot-tag-item {
      padding: 3px 8px;
    }
  }
}

.all {
  padding: 0 10px;
  border: 1px solid #dddddd;
  border-radius: 5px;

  &:hover {
    border-color: #5292fe;
  }
}

.all-tag {
  position: absolute;
  top: 30px;
  z-index: 9;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 400px;
  height: 300px;
  overflow-y: scroll;
  background: #fff;
  box-shadow: 0px 0px 10px 5px #eee;
  padding: 10px 0px;

  .all-tag-item {
    padding: 8px 0;
    width: 80px;
    text-align: center;

    span {
      padding: 3px 5px;
    }
  }
}

.activeHot {
  color: #5292fe;
  background: rgba(100, 149, 237, 0.2);
  border-radius: 5px;
}

.activeAll {
  color: #5292fe;
  background: rgba(100, 149, 237, 0.2);
  border-radius: 5px;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #fff;
}
</style>