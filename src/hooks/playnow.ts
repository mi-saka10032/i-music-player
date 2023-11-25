import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks'
import { fetchPlaylistDetail, setAutoplay, setLoading } from '@/store/playlist'
import { clearPlayerStatus } from '@/store/playerStatus'
import { clearPlayerProgress } from '@/store/playerProgress'

export const playNowById = () => {
  const dispatch = useAppDispatch()

  const getPlaylists = useCallback((id: number, index: number = 0) => {
    // 开启列表栏loading
    dispatch(setLoading(true))
    // 使用自动播放
    dispatch(setAutoplay(true))
    // 清理播放状态
    dispatch(clearPlayerStatus())
    dispatch(clearPlayerProgress())
    // 立刻获取完整歌单列表
    void dispatch(fetchPlaylistDetail({ id, index }))
  }, [])

  return getPlaylists
}
