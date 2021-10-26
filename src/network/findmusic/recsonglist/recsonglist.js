import { request } from "../../request"

// 获取精品歌单标签列表
export function getTopHighqualityTag() {
  return request({
    url: "/playlist/highquality/tags"
  });
}

// 获取顶部精品歌单
export function getTopHighquality(cat, limit) {
  return request({
    url: "/top/playlist/highquality",
    params: {
      cat,
      limit
    }
  });
}
// 获取所有歌单分类标签
export function getAllTag() {
  return request({
    url: "/playlist/catlist",
  });
}
// 获取热门歌单分类标签
export function getHotTag() {
  return request({
    url: "/playlist/hot",
  });
}

// 获取歌单
export function getSongList(cat, limit, offset) {
  return request({
    url: "/top/playlist",
    params: {
      cat,
      limit,
      offset, // 用于分页 （页码 -1）* limit
    }
  });
}