declare module '*.png'

// Netease响应值结构
interface CommonRes {
  code: number
  [key: string]: any
}

/** ---------- 轮播图 ---------- */
declare enum BannerType {
  pc = 0,
  android = 1,
  iphone = 2,
  ipad = 3,
}

type Banners = Array<{
  encodeId: string
  imageUrl: string
}>

// 轮播图Response
interface BannersRes extends CommonRes {
  banners: Banners
}
/** ---------- 轮播图 ---------- */

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

// 歌单追踪歌曲信息列表
type TracksLists = Array<{
  id: number
  name: string
  ar: AR[]
  al: AL
  dt: number
}>

// 歌单详情Response
interface PlayListDetailRes extends CommonRes {
  playlist: {
    id: number
    name: string
    tracks: TracksLists
  }
}

// 单曲链接详情Response
interface SongRes extends CommonRes {
  data: Song[]
}
/** ---------- 歌单与歌曲 ---------- */

/** ---------- 登录状态与用户信息 ---------- */
// 登录key Response
interface LoginKeyRes extends CommonRes {
  unikey: string
}

// 登录base64 Response
interface LoginCodeRes extends CommonRes {
  data: {
    qrurl: string
    qrimg: string
  }
}

// 登录状态信息 Response
interface QRStatusInfo extends CommonRes {
  message?: string
  nickname?: string
  avatarUrl?: string
}

// 登录检查信息 FetchResponse
interface LoginCheckRes extends TauriFetchResponse<QRStatusInfo> {}

// 用户信息 Response
interface AccountInfoRes extends CommonRes {
  account?: {
    id: number
    userName: string
  }
  profile?: {
    avatarUrl: string
    nickname: string
  }
}
/** ---------- 登录状态与用户信息 ---------- */
