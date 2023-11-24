import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks'
import { fetchPlaylistDetail, setAutoplay, setLoading, setPlaylists } from '@/store/playlist'
import { type SongData } from '@/core/playerType'

export const playNowById = () => {
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

export const playNowByLists = () => {
  const dispatch = useAppDispatch()

  const setTemporaryLists = useCallback((playlists: SongData[]) => {
    // 使用自动播放
    dispatch(setAutoplay(true))
    dispatch(setPlaylists(playlists))
  }, [])

  return setTemporaryLists
}
