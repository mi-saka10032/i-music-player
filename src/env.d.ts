// Netease响应值结构

interface CommonRes {
  code: number
  [key: string]: any
}

type Banners = Array<{
  encodeId: string
  imageUrl: string
}>

// 轮播图Response
interface BannersRes extends CommonRes {
  banners: Banners
}

type PlayLists = Array<{
  id: number
  name: string
  picUrl: string
  playCount: number
}>

// 每日推荐歌单Response
interface PlayListsRes extends CommonRes {
  result: PlayLists
}

type ResourceLists = Array<{
  id: number
  name: string
  picUrl: string
  playcount: number
}>

interface ResourceListsRes extends CommonRes {
  recommend: ResourceLists
}

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
