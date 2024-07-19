import { memo, useCallback, useContext, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { playlistInfoAtom } from '@/store'
import GlobalContext from '@/layout/context'
import { useMusicDetail, usePlaylists } from '@/hooks'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { getPlaylistDetail } from '@/api'

const MusicDetail = memo(() => {
  const {
    id,
    loading,
    setLoading,
    playlistHeader,
    setPlaylistHeader,
    listsIds
  } = useMusicDetail()

  const { player } = useContext(GlobalContext)

  const { getDefaultPlaylists } = usePlaylists()

  const playlistInfo = useAtomValue(playlistInfoAtom)

  const checkById = useCallback((songId: number) => {
    const currentListId = Number(id)
    if (currentListId === playlistInfo.playId) {
      player.setId(songId)
    } else {
      getDefaultPlaylists(currentListId, songId)
    }
  }, [id, playlistInfo])

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
      <MusicDetailHeader loading={loading} playlistHeader={playlistHeader}>
        <MusicDetailTab listsIds={listsIds} checkById={checkById} isCustom={false} />
      </MusicDetailHeader>
    </div>
  )
})

MusicDetail.displayName = 'MusicDetail'
export default MusicDetail
