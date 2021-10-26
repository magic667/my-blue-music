import { request } from "../request";

// 获取收藏的专辑
export function getSubAlbum(timestamp) {
  return request({
    url: '/album/sublist',
    params: {
      timestamp,
      limit: 48
    }
  });
}
// 收藏的歌手
export function getSubSinger(timestamp) {
  return request({
    url: '/artist/sublist',
    params: {
      timestamp,
      limit: 48
    }
  });
}
// 收藏的Mv和视频
export function getSubMv(timestamp) {
  return request({
    url: '/mv/sublist',
    params: {
      timestamp,
      limit: 40
    }
  });
}
