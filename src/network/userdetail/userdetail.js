import { request } from "../request";

// 获取用户详情
export function getUserDetail(uid, timestamp) {
  return request({
    url: '/user/detail',
    params: {
      uid,
      timestamp
    }
  });
}

// 获取用户歌单
export function getUserSonglist(uid, timestamp) {
  return request({
    url: 'user/playlist',
    params: {
      uid,
      timestamp
    }
  });
}

// 获取用户关注列表
export function getUserFollows(uid, offset, limit, timestamp) {
  return request({
    url: '/user/follows',
    params: {
      uid,
      offset,
      limit,
      timestamp,

    }
  });
}
//获取用户粉丝列表
export function getUserFolloweds(uid, offset, limit = 48) {
  return request({
    url: '/user/followeds',
    params: {
      uid,
      offset,
      limit
    }
  });
}

export function subUser(t, id) {
  return request({
    url: '/follow',
    params: {
      t,
      id
    }
  });
}
