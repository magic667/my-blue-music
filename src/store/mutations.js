export default {
  // 1.更新登录状态
  updateLogin(state, payload) {
    state.isLogin = payload;
  },
  // 保存用户信息
  saveUserInfo(state, payload) {
    state.userInfo = payload;
  },
  // 保存用户歌单
  saveUserSongList(state, payload) {
    state.userSongList = payload;
  },

  // 保存用户关注列表
  saveUserFollowsList(state, payload) {
    state.userFollowList = payload;
  },

  // 2.保存用户的收藏 
  // 收藏的专辑
  saveFavoriteAlbum(state, payload) {
    state.subAlbumlist = payload;
  },
  // 歌手
  saveFavoriteSinger(state, payload) {
    state.subSingerlist = payload;
  },
  // mv
  saveFavoriteMv(state, payload) {
    state.subMvlist = payload;
  },

  // 3.音乐播放 
  // 改变音乐播放状态
  changePlayState(state, payload) {
    state.isPlaying = payload;
  },

  // 切换播放模式
  changePlayModel(state, payload) {
    state.playModel = payload;
  },

  // 保存歌曲url
  saveSongUrl(state, payload) {
    state.songUrl = payload;
  },

  // 保存当前播放歌曲详情，并添加当前播放歌曲到历史记录
  saveSongDetail(state, payload) {
    state.nowSongDetail = payload;
    // 添加当前播放歌曲到历史记录
    let index = state.historyPlay.findIndex((item) => {
      return payload.id == item.id;
    });
    // 如果列表不存在相同歌曲，再添加到播放历史列表
    if (index == -1) {
      state.historyPlay.unshift(payload);
      localStorage.setItem('historyPlay', JSON.stringify(state.historyPlay));
    }
  },
  // 添加单曲到当前播放列表
  addPlayinglist(state, song) {
    // 列表查找相同的歌曲
    let index = state.playingList.findIndex((item) => {
      return item.id == song.id;
    });
    // 如果列表不存在相同的歌曲，再添加到播放列表
    if (index == -1) {
      state.playingList.unshift(song);
    }
  },
  // 点击播放全部，添加当前歌单所有歌曲到播放列表
  addAllSong(state, payload) {
    state.playingList = payload;
  },
  // 删除播放列表单曲
  deleteSong(state, songId) {
    let index = state.playingList.findIndex((item) => {
      return item.id == songId;
    });
    state.playingList.splice(index, 1);
  },
  // 清空播放列表
  deleteAll(state) {
    state.playingList = [];
    state.songUrl = "";
    state.nowSongDetail = {};
    state.isPlaying = false;
  },
  // 清空历史记录
  deleteAllHistory(state) {
    state.historyPlay = [];
    localStorage.setItem("historyPlay", JSON.stringify(state.historyPlay));
  },
  // 清空历史记录单曲
  deleteHistory(state, songId) {
    let index = state.historyPlay.findIndex((item) => {
      return item.id == songId;
    });
    state.historyPlay.splice(index, 1);
    localStorage.setItem('historyPlay', JSON.stringify(state.historyPlay));
  },
  // 是否显示当前歌曲详情页
  showSongDetail(state) {
    state.isShowSongDetail = !state.isShowSongDetail;
  },
  // 保存当前歌曲播放的实时秒数
  saveCurrentSecond(state, payload) {
    state.currentSecond = payload;
  }
}

