import tauriClient from '@/request'

// 获取歌单详情
export const getPlaylistDetail = async (id: number) => await tauriClient.get<PlayListDetailRes>('/playlist/detail', { id })

// 获取歌曲详情（getPlaylistDetail无法获取全部歌曲信息，现有手段是获取全部ids进行批量拉取）
export const getSongDetail = async (allIds: number[]) => {
  // /song/detail要求 ids的格式为 "[{\"id\": 123}]"" 的JSON数组
  const ids = JSON.stringify(allIds.map(id => ({ id })))
  return await tauriClient.get<AllSongsRes>('/song/detail', { ids })
}

// 获取歌曲链接
export const getSongUrl = async (id: number) => await tauriClient.get<SongRes>('/song/url', { id })

// 获取歌词
export const getSongLyric = async (id: number) => await tauriClient.get<LyricRes>('/lyric', { id })
