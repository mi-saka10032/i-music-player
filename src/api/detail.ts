import tauriClient from '@/request'

// 获取歌单详情
export const getPlaylistDetail = async (id: number) => await tauriClient.get<PlayListDetailRes>('/playlist/detail', { id })

// 获取歌曲详情（getPlaylistDetail无法获取全部歌曲信息，现有手段是获取全部ids进行批量拉取）
export const getSongDetail = async (allIds: number[]): Promise<TracksLists> => {
  // allIds长度超出1000，需要切割长度，分批调用统一返回
  const batchSize = 1000
  const requests: string[] = []
  const result: TracksLists = []
  for (let i = 0; i < allIds.length; i += batchSize) {
    const idSlice = allIds.slice(i, i + batchSize)
    // /song/detail要求 ids的格式为 "[{\"id\": 123}]"" 的JSON数组
    requests.push(JSON.stringify(idSlice.map(id => ({ id }))))
  }
  // 使用Promise.all并行处理所有批次
  return await Promise.all(
    requests.map(
      async request => {
        await tauriClient.get<AllSongsRes>('/song/detail', { ids: request })
          .then(songsRes => {
            result.push(...songsRes.songs)
          })
      })
  ).then(() => {
    // 所有批次处理完成后，返回结果
    console.log(result)
    return result
  })
}

// 获取歌曲链接
export const getSongUrl = async (id: number) => await tauriClient.get<SongRes>('/song/url', { id })

// 获取歌词
export const getSongLyric = async (id: number) => await tauriClient.get<LyricRes>('/lyric', { id })
