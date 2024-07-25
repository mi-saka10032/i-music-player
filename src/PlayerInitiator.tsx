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
  songActiveIndexAtom
} from '@/store'
import { selectDB } from './utils'
import { type SongData, playerInstance } from './core/player'
import { useEffectLoading } from './hooks'
import LoadingContainer from './components/loadingContainer'
import LoadingInstance from './components/loadingInstance'

// Core Player Init
const PlayerInitiator = memo((props: PropsWithChildren<unknown>) => {
  const setPlaylistInfo = useSetAtom(playlistInfoAtom)
  const setSongLists = useSetAtom(songListsAtom)
  const setSongActiveId = useSetAtom(songActiveIdAtom)
  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const initPlayer = useCallback(async () => {
    let songLists: SongData[] = []
    let songActiveIndex = 0
    await Promise.allSettled([
      selectDB<SongData[]>(SONG_LISTS_CACHE_NAME)
        .then((data) => {
          if (data != null) {
            songLists = data
            setSongLists(data)
          }
        }),
      selectDB<number>(SONG_ACTIVE_INDEX_CACHE_NAME)
        .then((data) => {
          if (data != null) {
            songActiveIndex = data
            setSongActiveIndex(data)
          }
        }),
      selectDB<number>(SONG_ACTIVE_ID_CACHE_NAME)
        .then((data) => {
          if (data != null) {
            setSongActiveId(data)
          }
        }),
      selectDB<PlaylistInfo>(PLAYLIST_INFO_CACHE_NAME)
        .then((data) => {
          if (data != null) {
            setPlaylistInfo(data)
          }
        })
    ])
    if (songLists.length > 0) {
      playerInstance.setPlaylist(songLists, songActiveIndex)
    }
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
