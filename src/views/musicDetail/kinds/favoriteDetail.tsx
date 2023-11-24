import { memo, useCallback, useEffect, useRef } from 'react'
import { getLikeLists, getSongDetail } from '@/api'
import { playNowByLists } from '@/hooks'
import useMusicDetail from '../hooks/useMusicDetail'
import MusicDetailHeader from '../components/header'
import MusicDetailTab from '../components/tab'
import { type SongData } from '@/core/playerType'

const FavoriteDetail = memo(() => {
  const {
    accountInfo,
    loading,
    setLoading,
    playlistHeader,
    setPlaylistHeader,
    listsIds
  } = useMusicDetail()

  const temporaryLists = useRef<SongData[]>([])
  const setTemporaryLists = playNowByLists()

  const playFavoriteLists = useCallback(() => {
    if (temporaryLists.current.length > 0) {
      setTemporaryLists(temporaryLists.current)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    getLikeLists(Number(accountInfo.account?.id))
      .then(res => {
        if (res.ids?.length > 0) {
          const ids = res.ids
          setPlaylistHeader(playlistHeader => ({
            ...playlistHeader,
            name: '我喜欢的音乐',
            creator: {
              userId: accountInfo.account?.id ?? 0,
              nickname: accountInfo.profile?.nickname ?? '',
              avatarUrl: accountInfo.profile?.avatarUrl ?? ''
            },
            trackIds: ids.map(id => ({ id }))
          }))
          getSongDetail(ids)
            .then(res => {
              setPlaylistHeader(playlistHeader => ({
                ...playlistHeader,
                coverImgUrl: res[0].al.picUrl
              }))
              temporaryLists.current = res.map(item => ({
                id: item.id,
                name: item.name,
                artists: item.ar,
                album: item.al,
                time: item.dt
              }))
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          throw new Error('喜欢音乐列表为空')
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return <div className="pt-8">
    <MusicDetailHeader
      loading={loading}
      playlistHeader={playlistHeader}
      onPlayAll={playFavoriteLists}
    >
      <MusicDetailTab listsIds={listsIds} />
    </MusicDetailHeader>
  </div>
})

FavoriteDetail.displayName = 'FavoriteDetail'
export default FavoriteDetail
