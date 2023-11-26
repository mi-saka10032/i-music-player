import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks'
import { fetchPlaylistDetail, fetchJayPlaylistDetail, setAutoplay, setLoading } from '@/store/playlist'
import { clearPlayerStatus } from '@/store/playerStatus'
import { clearPlayerProgress } from '@/store/playerProgress'

export const playNowById = () => {
  const dispatch = useAppDispatch()

  const getPlaylists = useCallback((playlistId: number, songId: number = 0) => {
    // 开启列表栏loading
    dispatch(setLoading(true))
    // 使用自动播放
    dispatch(setAutoplay(true))
    // 清理播放状态
    dispatch(clearPlayerStatus())
    dispatch(clearPlayerProgress())
    // 立刻获取完整歌单列表
    void dispatch(fetchPlaylistDetail({ playlistId, songId }))
  }, [])

  return getPlaylists
}

export const playNowByCustom = () => {
  const dispatch = useAppDispatch()

  const getJayPlaylists = useCallback((songId: number = 0) => {
    // 开启列表栏loading
    dispatch(setLoading(true))
    // 使用自动播放
    dispatch(setAutoplay(true))
    // 清理播放状态
    dispatch(clearPlayerStatus())
    dispatch(clearPlayerProgress())
    // 获取个人自定义歌单
    void dispatch(fetchJayPlaylistDetail(songId))
  }, [])

  return getJayPlaylists
}
