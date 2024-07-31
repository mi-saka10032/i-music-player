import { memo, useCallback, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { playlistInfoAtom } from '@/store'
import { useFetchPlaylists, useMusicDetail } from '@/hooks'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { CUSTOM_ID, CUSTOM_IMG, CUSTOM_NAME } from '@/utils'
import { playerInstance } from '@/core'

const CustomDetail = memo(() => {
  const { playlistHeader, setPlaylistHeader } = useMusicDetail()

  const { getCustomPlaylists } = useFetchPlaylists()

  const playlistInfo = useAtomValue(playlistInfoAtom)

  const handlePlayWithExactId = useCallback((songId: number) => {
    if (CUSTOM_ID === playlistInfo.playId) {
      playerInstance.setId(songId)
    } else {
      void getCustomPlaylists(songId)
    }
  }, [playlistInfo])

  const handlePlayAll = useCallback(() => {
    void getCustomPlaylists()
  }, [])

  useEffect(() => {
    setPlaylistHeader(playlistHeader => ({
      ...playlistHeader,
      id: CUSTOM_ID,
      name: CUSTOM_NAME,
      coverImgUrl: CUSTOM_IMG
    }))
  }, [])

  return (
    <div className="pt-8">
      <MusicDetailHeader loading={false} playlistHeader={playlistHeader} onPlayAll={handlePlayAll} >
        {/* 自定义的歌单 isCustom: true */}
        <MusicDetailTab isCustom={true} listsIds={[]} handlePlayWithExactId={handlePlayWithExactId} />
      </MusicDetailHeader>
    </div>
  )
})

CustomDetail.displayName = 'CustomDetail'
export default CustomDetail
