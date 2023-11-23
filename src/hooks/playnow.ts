import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks'
import { fetchPlaylistDetail, setAutoplay, setLoading } from '@/store/playlist'

export const playNow = () => {
  const dispatch = useAppDispatch()

  const getPlaylists = useCallback((id: number) => {
    // 开启列表栏loading
    dispatch(setLoading(true))
    // 使用自动播放
    dispatch(setAutoplay(true))
    // 立刻获取完整歌单列表
    void dispatch(fetchPlaylistDetail(id))
  }, [])

  return getPlaylists
}
