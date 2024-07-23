import { memo, useCallback, useContext, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { playlistInfoAtom, useFetchPlaylists } from '@/store'
import GlobalContext from '@/layout/context'
import { useMusicDetail } from '@/hooks'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { CUSTOM_ID, CUSTOM_IMG, CUSTOM_NAME } from '@/utils'

const CustomDetail = memo(() => {
  const {
    loading,
    playlistHeader,
    listsIds,
    setPlaylistHeader
  } = useMusicDetail()

  const { player } = useContext(GlobalContext)

  const { getCustomPlaylists } = useFetchPlaylists()

  const playlistInfo = useAtomValue(playlistInfoAtom)

  const checkById = useCallback((songId: number) => {
    if (CUSTOM_ID === playlistInfo.playId) {
      player.setId(songId)
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
      <MusicDetailHeader loading={loading} playlistHeader={playlistHeader} onPlayAll={handlePlayAll} >
        {/* 自定义的歌单 isCustom: true */}
        <MusicDetailTab listsIds={listsIds} checkById={checkById} isCustom={true} />
      </MusicDetailHeader>
    </div>
  )
})

CustomDetail.displayName = 'CustomDetail'
export default CustomDetail
