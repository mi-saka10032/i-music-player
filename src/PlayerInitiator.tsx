import { type PropsWithChildren, memo, useCallback } from 'react'
import { useSetAtom } from 'jotai'
import {
  type PlaylistInfo,
  PLAYLIST_INFO_CACHE_NAME,
  playlistInfoAtom,
  SONG_LISTS_CACHE_NAME,
  songListsAtom,
  SONG_ACTIVE_ID_CACHE_NAME,
  songActiveIdAtom,
  SONG_ACTIVE_INDEX_CACHE_NAME,
  songActiveIndexAtom,
  PLAY_TYPE_CACHE_NAME,
  playTypeAtom,
  MUTE_CACHE_NAME,
  muteAtom,
  VOLUME_CACHE_NAME,
  volumeAtom,
  PROGRESS_CACHE_NAME,
  progressAtom,
  RECOMMEND_CACHE_NAME,
  recommendAtom,
  COOKIE_CACHE_NAME,
  cookieAtom,
  ACCOUNT_CACHE_NAME,
  accountAtom
} from '@/store'
import { selectDB } from './utils'
import { playerInstance } from './core'
import { useEffectLoading } from './hooks'
import LoadingContainer from './components/loadingContainer'
import LoadingInstance from './components/loadingInstance'

// Core Player Init
const PlayerInitiator = memo((props: PropsWithChildren<unknown>) => {
  const setSongLists = useSetAtom(songListsAtom)
  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const setPlaylistInfo = useSetAtom(playlistInfoAtom)
  const setSongActiveId = useSetAtom(songActiveIdAtom)
  const setPlayType = useSetAtom(playTypeAtom)
  const setMute = useSetAtom(muteAtom)
  const setVolume = useSetAtom(volumeAtom)
  const setProgress = useSetAtom(progressAtom)
  const setRecommend = useSetAtom(recommendAtom)
  const setCookie = useSetAtom(cookieAtom)
  const setAccount = useSetAtom(accountAtom)

  const initPlayer = useCallback(async () => {
    const setCacheMap = {
      [SONG_ACTIVE_ID_CACHE_NAME]: setSongActiveId,
      [PLAY_TYPE_CACHE_NAME]: setPlayType,
      [MUTE_CACHE_NAME]: setMute,
      [VOLUME_CACHE_NAME]: setVolume,
      [PROGRESS_CACHE_NAME]: setProgress,
      [RECOMMEND_CACHE_NAME]: setRecommend,
      [COOKIE_CACHE_NAME]: setCookie,
      [ACCOUNT_CACHE_NAME]: setAccount
    }

    let songLists: SongData[] = []
    const selectLists = selectDB<SongData[]>(SONG_LISTS_CACHE_NAME)
      .then((data) => {
        if (data != null) {
          songLists = data
          setSongLists(data)
        }
      })

    let playlistInfo: PlaylistInfo = { playId: 0, playName: '' }
    const selectInfo = selectDB<PlaylistInfo>(PLAYLIST_INFO_CACHE_NAME)
      .then((data) => {
        if (data != null) {
          playlistInfo = data
          setPlaylistInfo(data)
        }
      })

    let songActiveIndex = 0
    const selectId = selectDB<number>(SONG_ACTIVE_INDEX_CACHE_NAME)
      .then((data) => {
        if (data != null) {
          songActiveIndex = data
          setSongActiveIndex(data)
        }
      })

    const promises = Object.entries(setCacheMap).map(
      async ([cacheName, setFn]: [string, (value: any) => void]) => {
        await selectDB(cacheName)
          .then((data) => {
            if (data != null) {
              setFn(data)
            }
          })
      }
    )

    await Promise.allSettled([
      selectInfo,
      selectLists,
      selectId,
      ...promises
    ])

    playerInstance.setPlaylist({
      playlist: songLists,
      playId: playlistInfo.playId,
      index: songActiveIndex,
      autoplay: false
    })
  }, [])

  const { loading } = useEffectLoading([], initPlayer)

  return (
    <LoadingContainer loading={loading} fallback={<LoadingInstance />}>
      {props.children}
    </LoadingContainer>
  )
})

PlayerInitiator.displayName = 'PlayerInitiator'
export default PlayerInitiator
