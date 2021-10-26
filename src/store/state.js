export default {
  // 1.是否登录
  isLogin: localStorage.getItem('isLogin') ? JSON.parse(localStorage.getItem('isLogin')) : false,
  // 用户信息
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  // 用户私人歌单
  userSongList: localStorage.getItem('userSongList') ? JSON.parse(localStorage.getItem('userSongList')) : [],
  // 用户关注列表
  userFollowList: [],
  // 用户收藏
  subAlbumlist: [],
  subSingerlist: [],
  subMvlist: [],

  // 2.音乐播放
  // 音乐播放状态
  isPlaying: false,
  // 播放模式
  playModel: localStorage.getItem('playModel') ? JSON.parse(localStorage.getItem('playModel')) : 1,
  // 当前歌曲url
  songUrl: "",
  // 当前歌曲详情
  nowSongDetail: {},
  // 正在播放列表
  playingList: [],
  // 历史播放列表
  historyPlay: localStorage.getItem('historyPlay') ? JSON.parse(localStorage.getItem('historyPlay')) : [],
  // 是否显示当前歌曲详情页
  isShowSongDetail: false,
  // 当前歌曲播放的实时秒数,
  currentSecond: null,
}