import { request } from '../request';

// 获取每日推荐歌曲（需要登录）
export function getRecSongs() {
  return request({
    url: '/recommend/songs',
  });
}

// 获取每日推荐歌单
export function getRecSongList() {
  return request({
    url: '/recommend/resource',
  });
}