import tauriClient from '@/request'

// 获取歌单详情
export const getPlaylistDetail = async (id: number) => await tauriClient.get<PlayListDetailRes>('/playlist/detail', { id })

// 获取歌曲详情
export const getSongUrl = async (id: number) => await tauriClient.get<SongRes>('/song/url', { id })
