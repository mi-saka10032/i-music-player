import { atom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { type SongData } from '@/core/player'
import { getJaySongs, getPlaylistDetail, getSongDetail } from '@/api'
import { normalSongDataTrans, customSongDataTrans } from '@/utils/formatter'

interface PlaylistInfo {
  playId: number
  playName: string
}

export interface FetchPlaylistDetailRes extends PlaylistInfo {
  songLists: SongData[]
  activeId: number
}

export const autoplayAtom = atom(false)

export const loadingAtom = atom(false)

export const playlistInfoAtom = createAtomWithIndexedDB<PlaylistInfo>({
  cacheName: 'playlistInfo',
  initialValue: {
    playId: 0,
    playName: ''
  }
})

export const songListsAtom = createAtomWithIndexedDB<SongData[]>({
  cacheName: 'songLists',
  initialValue: []
})

export const songActiveIdAtom = createAtomWithIndexedDB<number>({
  cacheName: 'songActiveId',
  initialValue: 0
})

export const songActiveIndexAtom = createAtomWithIndexedDB<number>({
  cacheName: 'songActiveIndex',
  initialValue: 0
})

export const fetchPlaylistDetail = async ({ playlistId, songId }: { playlistId: number, songId: number }): Promise<FetchPlaylistDetailRes> => {
  const result = await getPlaylistDetail(playlistId)
  // 遍历trackIds获取完整id，再拉取一次全量歌曲信息
  const allIds = result.playlist.trackIds.map(item => item.id)
  const completeSongs = await getSongDetail(allIds)
  return {
    playId: result.playlist.id,
    playName: result.playlist.name,
    songLists: normalSongDataTrans(completeSongs),
    activeId: songId
  }
}

export const fetchJayPlaylistDetail = async (songId: number): Promise<FetchPlaylistDetailRes> => {
  const { customId, customName, list } = await getJaySongs()
  return {
    playId: customId,
    playName: customName,
    songLists: customSongDataTrans(list),
    activeId: songId
  }
}
