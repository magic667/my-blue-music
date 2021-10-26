import { request } from "../request";
// 获取歌单详情
export function getSongListDetail(id, timestamp) {
  return request({
    url: '/playlist/detail',
    params: {
      id,
      timestamp
    }
  })
}
// 获取每首歌的详细信息
export function getEverySongDetail(ids, timestamp) {
  return request({
    url: '/song/detail',
    params: {
      ids,  //音乐id(支持多个id, 用 , 隔开)
      timestamp
    }
  })
}
// 获取歌单评论
export function getSongListComment(id, offset, timestamp) {
  return request({
    url: '/comment/playlist',
    params: {
      id,
      offset,
      timestamp
    }
  })
}
// 获取歌单的收藏者
export function getSongListSubscribers(id, offset, limit = 48) {
  return request({
    url: '/playlist/subscribers',
    params: {
      id,
      offset,
      limit,
    }
  })
}

// 收藏/取消收藏歌单
export function subSongList(t, id) {
  return request({
    url: '/playlist/subscribe',
    params: {
      t,
      id,
    }
  })
}