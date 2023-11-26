/** 个人服务器数据响应结构 */
type CustomSongs = Array<{
  id: number
  songName: string
  album: {
    id: number
    albumName: string
    coverUrl: string
  }
  singers: Array<{
    id: number
    singerName: string
    coverUrl: string
  }>
  duration: number
  lyric: string
  musicUrl: string
}>

interface CustomSongsRes extends CommonRes {
  data: {
    list: CustomSongs
    pageNo: number
    pageSize: number
    total: number
  }
}

interface CustomDetail {
  customId: number
  customName: string
  list: CustomSongs
}
/** 个人服务器数据响应结构 */
