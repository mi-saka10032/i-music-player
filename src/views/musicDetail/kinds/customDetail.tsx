import { memo, useCallback, useContext, useEffect } from 'react'
import useMusicDetail from '../hooks/useMusicDetail'
import { CUSTOM_ID, CUSTOM_IMG, CUSTOM_NAME } from '@/utils/constant'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { playNowByCustom } from '@/hooks'
import GlobalContext from '@/layout/context'
import { PlayerEvent } from '@/core/playerType'

const CustomDetail = memo(() => {
  const {
    loading,
    playlistHeader,
    listsIds,
    setPlaylistHeader
  } = useMusicDetail()

  const { player } = useContext(GlobalContext)

  const getJayPlaylists = playNowByCustom()

  const playAllLists = useCallback(() => {
    getJayPlaylists()
  }, [])

  const checkById = useCallback((currentId: number) => {
    player.emit(PlayerEvent.CHECK_BY_ID, {
      listId: CUSTOM_ID,
      songId: currentId
    })
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
      <MusicDetailHeader
        loading={loading}
        playlistHeader={playlistHeader}
        onPlayAll={playAllLists}
       >
        {/* 自定义的歌单 isCustom: true */}
        <MusicDetailTab listsIds={listsIds} checkById={checkById} isCustom={true} />
      </MusicDetailHeader>
    </div>
  )
})

CustomDetail.displayName = 'CustomDetail'
export default CustomDetail
