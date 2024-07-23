import { useCallback } from 'react'
import { atom, useSetAtom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { type SongData } from '@/core/player'
import { getJaySongs, getPlaylistDetail, getSongDetail } from '@/api'
import { normalSongDataTrans, customSongDataTrans } from '@/utils'
import { durationAtom, playerStatusAtom, progressAtom } from './playerController'

interface PlaylistInfo {
  playId: number
  playName: string
}

export interface FetchPlaylistDetailRes extends PlaylistInfo {
  songLists: SongData[]
  activeId: number
}

export const autoplayAtom = atom(false)

export const queueLoadingAtom = atom(false)

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

export function useFetchPlaylists () {
  const setLoading = useSetAtom(queueLoadingAtom)
  const setAutoplay = useSetAtom(autoplayAtom)
  const setPlayerStatus = useSetAtom(playerStatusAtom)
  const setProgress = useSetAtom(progressAtom)
  const setDuration = useSetAtom(durationAtom)
  const setPlaylistInfo = useSetAtom(playlistInfoAtom)
  const setSongLists = useSetAtom(songListsAtom)
  const setSongActiveId = useSetAtom(songActiveIdAtom)
  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const setPreWork = useCallback(() => {
    // 开启列表栏loading
    setLoading(true)
    // 使用自动播放
    setAutoplay(true)
    // 清理播放状态
    setPlayerStatus('none')
    void setDuration(0)
    void setProgress(0)
  }, [])

  const setPostWork = useCallback((payload: FetchPlaylistDetailRes) => {
    setLoading(false)
    void setPlaylistInfo({
      playId: payload.playId,
      playName: payload.playName
    })
    void setSongLists(payload.songLists)
    if (payload.activeId === 0) {
      void setSongActiveIndex(0)
    } else {
      const index = payload.songLists.findIndex((item) => item.id === payload.activeId)
      const actualIndex = index !== -1 ? index : 0
      void setSongActiveIndex(actualIndex)
      if (actualIndex > 0) {
        void setSongActiveId(payload.activeId)
      }
    }
  }, [])

  const getDefaultPlaylists = useCallback(async (playlistId: number, songId: number = 0) => {
    setPreWork()
    // 立刻获取完整歌单列表
    const result = await getPlaylistDetail(playlistId)
    // 遍历trackIds获取完整id，再拉取一次全量歌曲信息
    const allIds = result.playlist.trackIds.map(item => item.id)
    const completeSongs = await getSongDetail(allIds)

    setPostWork({
      playId: result.playlist.id,
      playName: result.playlist.name,
      songLists: normalSongDataTrans(completeSongs),
      activeId: songId
    })
  }, [])

  const getCustomPlaylists = useCallback(async (songId: number = 0) => {
    setPreWork()
    // 获取个人自定义歌单
    const { customId, customName, list } = await getJaySongs()

    setPostWork({
      playId: customId,
      playName: customName,
      songLists: customSongDataTrans(list),
      activeId: songId
    })
  }, [])

  const clearPlaylists = useCallback(() => {
    setLoading(false)
    setAutoplay(false)
    setPlayerStatus('none')
    void setDuration(0)
    void setProgress(0)
    void setPlaylistInfo({
      playId: 0,
      playName: ''
    })
    void setSongLists([])
    void setSongActiveId(0)
    void setSongActiveIndex(0)
  }, [])

  return {
    clearPlaylists,
    getDefaultPlaylists,
    getCustomPlaylists
  }
}
