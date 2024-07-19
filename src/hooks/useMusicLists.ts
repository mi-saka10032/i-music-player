import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import {
  type FetchPlaylistDetailRes,
  autoplayAtom,
  durationAtom,
  fetchJayPlaylistDetail,
  fetchPlaylistDetail,
  loadingAtom,
  playerStatusAtom,
  playlistInfoAtom,
  progressAtom,
  songListsAtom,
  songActiveIndexAtom
} from '@/store'

export const usePlaylists = () => {
  const setLoading = useSetAtom(loadingAtom)
  const setAutoplay = useSetAtom(autoplayAtom)
  const setPlayerStatus = useSetAtom(playerStatusAtom)
  const setProgress = useSetAtom(progressAtom)
  const setDuration = useSetAtom(durationAtom)
  const setPlaylistInfo = useSetAtom(playlistInfoAtom)
  const setSongLists = useSetAtom(songListsAtom)
  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const setPreWork = useCallback(() => {
    // 开启列表栏loading
    setLoading(true)
    // 使用自动播放
    setAutoplay(true)
    // 清理播放状态
    setPlayerStatus('none')
    void setProgress(0)
    void setDuration(0)
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
    }
  }, [])

  const getDefaultPlaylists = useCallback((playlistId: number, songId: number = 0) => {
    setPreWork()
    // 立刻获取完整歌单列表
    void fetchPlaylistDetail({ playlistId, songId })
      .then((payload) => { setPostWork(payload) })
  }, [])

  const getCustomPlaylists = useCallback((songId: number = 0) => {
    setPreWork()
    // 获取个人自定义歌单
    void fetchJayPlaylistDetail(songId)
      .then((payload) => { setPostWork(payload) })
  }, [])

  return {
    getDefaultPlaylists,
    getCustomPlaylists
  }
}
