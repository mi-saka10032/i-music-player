import { memo, useCallback, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { playlistInfoAtom, useFetchPlaylists } from '@/store'
import { useMusicDetail } from '@/hooks'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { getPlaylistDetail } from '@/api'
import { playerInstance } from '@/core/player'

const MusicDetail = memo(() => {
  const {
    id,
    loading,
    setLoading,
    playlistHeader,
    setPlaylistHeader,
    listsIds
  } = useMusicDetail()

  const { getDefaultPlaylists } = useFetchPlaylists()

  const playlistInfo = useAtomValue(playlistInfoAtom)

  const checkById = useCallback((songId: number) => {
    if (id === playlistInfo.playId) {
      playerInstance.setId(songId)
    } else {
      void getDefaultPlaylists(id, songId)
    }
  }, [id, playlistInfo])

  const handlePlayAll = useCallback(() => {
    void getDefaultPlaylists(id)
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
      <MusicDetailHeader loading={loading} playlistHeader={playlistHeader} onPlayAll={handlePlayAll}>
        <MusicDetailTab listsIds={listsIds} checkById={checkById} isCustom={false} />
      </MusicDetailHeader>
    </div>
  )
})

MusicDetail.displayName = 'MusicDetail'
export default MusicDetail
