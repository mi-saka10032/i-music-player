import { type SongData } from '@/core/playerType'

// 时长格式化
export function durationTrans (millSeconds: number): string {
  const seconds: number = millSeconds / 1000
  let res: string = ''
  let h: string = parseInt(seconds / 3600 + '').toString()
  let m: string = parseInt(seconds % 3600 / 60 + '').toString()
  let s: string = parseInt(seconds % 3600 % 60 + '').toString()
  if (Number(h) > 0) {
    h = Number(h) < 10 ? '0' + h : '' + h
    res += h + ':'
  }
  m = Number(m) < 10 ? '0' + m : '' + m
  s = Number(s) < 10 ? '0' + s : '' + s
  res += m + ':' + s
  return res
}

// 播放次数转换
export function playCountTrans (count: number): string {
  if (count > Math.pow(10, 9)) {
    return Math.floor((count / Math.pow(10, 9))) + '亿'
  } else if (count > Math.pow(10, 4)) {
    return Math.floor((count / Math.pow(10, 4))) + '万'
  } else return String(count)
}

// 静态歌词转换
export function staticLyricTrans (str: string): string[] {
  const arr = str.split('\n').map(line => line.trim())
  arr.push('')
  return arr
}

export function millSecondsTransDate (time: number, format: string = 'yyyy-MM-dd') {
  const t = new Date(time)
  const tf = function (i: number) { return (i < 10 ? '0' : '') + i }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'mm':
        return tf(t.getMinutes())
      case 'ss':
        return tf(t.getSeconds())
      default:
        return ''
    }
  })
}

// 生成斑马纹底色class
export function generateZebraClass (index: number) {
  return index % 2 !== 0 ? 'bg-[#f6f6f6] hover:bg-[#f2f2f2] ' : 'bg-[#fdfdfd] hover:bg-[#f3f3f3] '
}

// 歌手数组转换
export function artistsArrayTrans (ar: AR[]) {
  return ar.map(item => item.name).join(' / ')
}

// 歌曲序号转换
export function serializeNumberTrans (index: number): string {
  index = index + 1
  if (index > 1000) return index + '+'
  if (index >= 10) return index + ''
  if (index > 0) return '0' + index
  return ''
}

// 默认网易云歌曲数据结构转化
export function normalSongDataTrans (trackLists: TracksLists): SongData[] {
  return trackLists.map(item => ({
    id: item.id,
    name: item.name,
    artists: item.ar,
    album: item.al,
    time: item.dt
  }))
}

// 自定义歌曲数据结构转化
export function customSongDataTrans (customSongs: CustomSongs): SongData[] {
  return customSongs.map(item => ({
    id: item.id,
    name: item.songName,
    artists: item.singers.map(singer => ({
      id: singer.id,
      name: singer.singerName
    })),
    album: {
      id: item.album.id,
      name: item.album.albumName,
      picUrl: item.album.coverUrl
    },
    // 自定义歌单 时长单位为秒
    time: item.duration * 1000,
    // 额外响应数据
    lyric: item.lyric,
    url: item.musicUrl
  }))
}
