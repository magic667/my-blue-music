import { request } from "../request";

// 登录
export function login(phone, password, timestamp) {
  return request({
    url: '/login/cellphone',
    params: {
      phone,
      password,
      timestamp
    }
  });
}

// 登出
export function logout(timestamp) {
  return request({
    url: '/logout',
    params: {
      timestamp
    }
  });
}

// 获取用户歌单
export function getUserSonglist(uid) {
  return request({
    url: '/user/playlist',
    params: {
      uid
    }
  });
}