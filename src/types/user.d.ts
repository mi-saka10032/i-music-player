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

/** 登录用户私有歌单 */
interface FavoriteRes extends CommonRes {
  checkPoint: number
  ids: number[]
}

interface UserPlaylistsRes extends CommonRes {
  playlist: PlayListDetail[]
}
/** 登录用户私有歌单 */
