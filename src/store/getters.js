export default {
  // 1.用户信息
  userInfo(state) {
    return state.userInfo;
  },
  // 用户歌单
  userSongList(state) {
    return state.userSongList;
  },
  // 用户关注列表
  userFollowList(state) {
    return state.userFollowList;
  },

  // 2.用户收藏
  subAlbumlist(state) {
    return state.subAlbumlist;
  },
  subSingerlist(state) {
    return state.subSingerlist;
  },
  subMvlist(state) {
    return state.subMvlist;
  },

  // 3.音乐播放
  // 音乐播放状态
  isPlaying(state) {
    return state.isPlaying;
  },
  // 播放模式
  playModel(state) {
    return state.playModel;
  },
  // 当前歌曲url
  songUrl(state) {
    return state.songUrl;
  },
  // 当前歌曲详情
  nowSongDetail(state) {
    return state.nowSongDetail;
  },
  // 正在播放列表
  playingList(state) {
    return state.playingList;
  },
  // 历史记录
  historyPlay(state) {
    return state.historyPlay;
  },
  // 是否显示当前歌曲详情页
  isShowSongDetail(state) {
    return state.isShowSongDetail;
  },
  // 当前歌曲播放的实时秒数
  currentSecond(state) {
    return state.currentSecond;
  }
}