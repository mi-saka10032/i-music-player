import { memo, useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { playlistInfoAtom } from '@/store'
import { useMusicDetail, useFetchPlaylists, useAsyncFn } from '@/hooks'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { getPlaylistDetail } from '@/api'
import { playerInstance } from '@/core'

const MusicDetail = memo(() => {
  const { id, initialPlaylistDetail } = useMusicDetail()

  const { getDefaultPlaylists } = useFetchPlaylists()

  const playlistInfo = useAtomValue(playlistInfoAtom)

  const handlePlayWithExactId = useCallback((songId: number) => {
    if (id === playlistInfo.playId) {
      playerInstance.setId(songId)
    } else {
      void getDefaultPlaylists(id, songId)
    }
  }, [id, playlistInfo])

  const handlePlayAll = useCallback(() => {
    void getDefaultPlaylists(id)
  }, [id])

  const initPlaylistDetail = useCallback(async (): Promise<PlayListDetail> => {
    const res = await getPlaylistDetail(id)
    const playlist = res.playlist
    if (playlist == null || typeof playlist !== 'object') return initialPlaylistDetail.current

    return {
      ...initialPlaylistDetail.current,
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
    }
  }, [id])

  const { data: playlistHeader, loading } = useAsyncFn(initPlaylistDetail, initialPlaylistDetail.current)

  const listsIds = useMemo<number[]>(() => {
    return playlistHeader.trackIds.map(item => item.id)
  }, [playlistHeader])

  return (
    <div className="pt-8">
      <MusicDetailHeader loading={loading} playlistHeader={playlistHeader} onPlayAll={handlePlayAll}>
        <MusicDetailTab listsIds={listsIds} handlePlayWithExactId={handlePlayWithExactId} isCustom={false} />
      </MusicDetailHeader>
    </div>
  )
})

MusicDetail.displayName = 'MusicDetail'
export default MusicDetail
