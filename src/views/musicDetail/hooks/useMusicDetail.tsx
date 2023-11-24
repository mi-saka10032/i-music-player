import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { playNowById, useAppSelector } from '@/hooks'

export default function useMusicDetail () {
  const { id } = useParams<{ id: string }>()

  const { accountInfo } = useAppSelector(state => state.user)

  const getPlaylists = playNowById()

  const [loading, setLoading] = useState(false)

  const [playlistHeader, setPlaylistHeader] = useState<PlayListDetail>({
    id: 0,
    name: '',
    tracks: [],
    trackIds: [],
    coverImgUrl: '',
    createTime: 0,
    creator: {
      userId: 0,
      nickname: '',
      avatarUrl: ''
    },
    subscribedCount: 0,
    shareCount: 0,
    tags: [],
    playCount: 0,
    description: ''
  })

  const listsIds = useMemo<number[]>(() => {
    return playlistHeader.trackIds.map(item => item.id)
  }, [playlistHeader])

  return {
    accountInfo,
    getPlaylists,
    id,
    loading,
    setLoading,
    playlistHeader,
    setPlaylistHeader,
    listsIds
  }
}
