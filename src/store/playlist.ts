import { useCallback } from 'react'
import { atom, useSetAtom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { type SongData } from '@/core/player'
import { getJaySongs, getPlaylistDetail, getSongDetail } from '@/api'
import { normalSongDataTrans, customSongDataTrans } from '@/utils'
import { playerStatusAtom, progressAtom } from './playerController'

export interface PlaylistInfo {
  playId: number
  playName: string
}

export interface FetchPlaylistDetailRes extends PlaylistInfo {
  songLists: SongData[]
  activeId: number
}

export const PLAYLIST_INFO_CACHE_NAME = 'playlistInfo'

export const playlistInfoAtom = createAtomWithIndexedDB<PlaylistInfo>({
  cacheName: PLAYLIST_INFO_CACHE_NAME,
  enableInitialCache: false,
  initialValue: {
    playId: 0,
    playName: ''
  }
})

export const SONG_LISTS_CACHE_NAME = 'songLists'

export const songListsAtom = createAtomWithIndexedDB<SongData[]>({
  cacheName: SONG_LISTS_CACHE_NAME,
  enableInitialCache: false,
  initialValue: []
})

export const SONG_ACTIVE_ID_CACHE_NAME = 'songActiveId'

export const songActiveIdAtom = createAtomWithIndexedDB<number>({
  cacheName: SONG_ACTIVE_ID_CACHE_NAME,
  enableInitialCache: false,
  initialValue: 0
})

export const SONG_ACTIVE_INDEX_CACHE_NAME = 'songActiveIndex'

export const songActiveIndexAtom = createAtomWithIndexedDB<number>({
  cacheName: SONG_ACTIVE_INDEX_CACHE_NAME,
  enableInitialCache: false,
  initialValue: 0
})

export const queueLoadingAtom = atom(false)

export function useFetchPlaylists () {
  const setLoading = useSetAtom(queueLoadingAtom)
  const setPlayerStatus = useSetAtom(playerStatusAtom)
  const setProgress = useSetAtom(progressAtom)
  const setPlaylistInfo = useSetAtom(playlistInfoAtom)
  const setSongLists = useSetAtom(songListsAtom)
  const setSongActiveId = useSetAtom(songActiveIdAtom)
  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const setPostWork = useCallback((payload: FetchPlaylistDetailRes) => {
    setPlaylistInfo({
      playId: payload.playId,
      playName: payload.playName
    })
    setSongLists(payload.songLists)
    if (payload.activeId === 0) {
      setSongActiveIndex(0)
    } else {
      const index = payload.songLists.findIndex((item) => item.id === payload.activeId)
      const actualIndex = index !== -1 ? index : 0
      setSongActiveIndex(actualIndex)
      if (actualIndex > 0) {
        setSongActiveId(payload.activeId)
      }
    }
  }, [])

  const getDefaultPlaylists = useCallback(async (playlistId: number, songId: number = 0) => {
    setLoading(true)
    try {
      const result = await getPlaylistDetail(playlistId)
      const allIds = result.playlist.trackIds.map(item => item.id)
      const completeSongs = await getSongDetail(allIds)

      setPostWork({
        playId: result.playlist.id,
        playName: result.playlist.name,
        songLists: normalSongDataTrans(completeSongs),
        activeId: songId
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCustomPlaylists = useCallback(async (songId: number = 0) => {
    setLoading(true)
    try {
      const { customId, customName, list } = await getJaySongs()

      setPostWork({
        playId: customId,
        playName: customName,
        songLists: customSongDataTrans(list),
        activeId: songId
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearPlaylists = useCallback(() => {
    setLoading(false)
    setPlayerStatus('none')
    setProgress(0)
    setPlaylistInfo({
      playId: 0,
      playName: ''
    })
    setSongLists([])
    setSongActiveId(0)
    setSongActiveIndex(0)
  }, [])

  return {
    clearPlaylists,
    getDefaultPlaylists,
    getCustomPlaylists
  }
}
