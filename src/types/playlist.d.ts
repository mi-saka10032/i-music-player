/** ---------- 歌单与歌曲 ---------- */
type PersonalLists = Array<{
  id: number
  name: string
  picUrl: string
  playCount: number
}>

// 每日推荐歌单Response
interface PersonalListsRes extends CommonRes {
  result: PersonalLists
}

// 注意 PersonalLists 和 ResourceLists 的playcount大小写有区别，接口返回数据如此
type ResourceLists = Array<{
  id: number
  name: string
  picUrl: string
  playcount: number
}>

// 登录每日推荐歌单Response
interface ResourceListsRes extends CommonRes {
  recommend: ResourceLists
}

// 歌手
interface AR {
  id: string | number
  name: string
}

// 专辑
interface AL {
  id: string | number
  name: string
  picUrl: string
}

// 单曲详情
interface SongDetail {
  id: string | number
  name: string
  artists: AR[]
  album: AL
}

// 单曲链接详情
interface Song {
  url: string
  /** time (ms) */
  time: number
}

// 歌单追踪歌曲信息列表（非完整）
type TracksLists = Array<{
  id: number
  name: string
  ar: AR[]
  al: AL
  alia: string[]
  dt: number
}>

// 歌单追踪id歌曲信息列表（完整）
type TrackIdsLists = Array<{
  id: number
}>

// 歌单详情Response
interface PlayListDetailRes extends CommonRes {
  playlist: {
    id: number
    name: string
    tracks: TracksLists
    trackIds: TrackIdsLists
    coverImgUrl: string
    createTime: number
    creator: {
      userId: number
      nickname: string
      avatarUrl: string
    }
    subscribedCount: number
    shareCount: number
    tags: string[]
    playCount: number
  }
}

// 单曲链接详情Response
interface SongRes extends CommonRes {
  data: Song[]
}

// 歌词详情Response
interface LyricRes extends CommonRes {
  lrc: {
    lyric: string
  }
}

// 歌单全歌曲Response
interface AllSongsRes extends CommonRes {
  songs: TracksLists
}
/** ---------- 歌单与歌曲 ---------- */
