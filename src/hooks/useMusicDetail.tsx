import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

export function useMusicDetail () {
  const { id } = useParams<{ id: string }>()

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
    description: '',
    specialType: 0,
    subscribed: false,
    userId: 0
  })

  const listsIds = useMemo<number[]>(() => {
    return playlistHeader.trackIds.map(item => item.id)
  }, [playlistHeader])

  return {
    id,
    loading,
    setLoading,
    playlistHeader,
    setPlaylistHeader,
    listsIds
  }
}
