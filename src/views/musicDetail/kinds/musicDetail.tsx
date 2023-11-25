import { memo, useCallback, useEffect } from 'react'
import useMusicDetail from '../hooks/useMusicDetail'
import { getPlaylistDetail } from '@/api'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'

const MusicDetail = memo(() => {
  const {
    id,
    loading,
    setLoading,
    playlistHeader,
    setPlaylistHeader,
    getPlaylists,
    listsIds
  } = useMusicDetail()

  const playAllLists = useCallback(() => {
    getPlaylists(Number(id))
  }, [id])

  useEffect(() => {
    setLoading(true)
    getPlaylistDetail(Number(id))
      .then(res => {
        const playlist = res.playlist
        if (playlist == null || typeof playlist !== 'object') return
        setPlaylistHeader(playlistHeader => ({
          ...playlistHeader,
          id: playlist.id ?? 0,
          name: playlist.name ?? '',
          coverImgUrl: playlist.coverImgUrl ?? '',
          createTime: playlist.createTime ?? 0,
          creator: {
            userId: playlist.creator?.userId ?? 0,
            nickname: playlist.creator?.nickname ?? '',
            avatarUrl: playlist.creator?.avatarUrl ?? ''
          },
          subscribedCount: playlist.subscribedCount,
          shareCount: playlist.shareCount,
          tags: playlist.tags,
          playCount: playlist.playCount,
          description: playlist.description,
          trackIds: playlist.trackIds
        }))
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  return (
    <div className="pt-8">
      <MusicDetailHeader
        loading={loading}
        playlistHeader={playlistHeader}
        onPlayAll={playAllLists}
       >
        <MusicDetailTab listsIds={listsIds} />
      </MusicDetailHeader>
    </div>
  )
})

MusicDetail.displayName = 'MusicDetail'
export default MusicDetail
