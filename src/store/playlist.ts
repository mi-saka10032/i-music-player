import { useCallback } from 'react'
import { atom, useSetAtom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { type SongData } from '@/core/player'
import { getJaySongs, getPlaylistDetail, getSongDetail } from '@/api'
import { normalSongDataTrans, customSongDataTrans } from '@/utils'
import { playerStatusAtom, progressAtom } from './playerController'

interface PlaylistInfo {
  playId: number
  playName: string
}

export interface FetchPlaylistDetailRes extends PlaylistInfo {
  songLists: SongData[]
  activeId: number
}

export const autoplayAtom = atom(false)

export const queueLoadingAtom = atom(false)

export const playlistInfoAtom = createAtomWithIndexedDB<PlaylistInfo>({
  cacheName: 'playlistInfo',
  initialValue: {
    playId: 0,
    playName: ''
  }
})

export const songListsAtom = createAtomWithIndexedDB<SongData[]>({
  cacheName: 'songLists',
  initialValue: []
})

export const songActiveIdAtom = createAtomWithIndexedDB<number>({
  cacheName: 'songActiveId',
  initialValue: 0
})

export const songActiveIndexAtom = createAtomWithIndexedDB<number>({
  cacheName: 'songActiveIndex',
  initialValue: 0
})

export function useFetchPlaylists () {
  const setLoading = useSetAtom(queueLoadingAtom)
  const setAutoplay = useSetAtom(autoplayAtom)
  const setPlayerStatus = useSetAtom(playerStatusAtom)
  const setProgress = useSetAtom(progressAtom)
  const setPlaylistInfo = useSetAtom(playlistInfoAtom)
  const setSongLists = useSetAtom(songListsAtom)
  const setSongActiveId = useSetAtom(songActiveIdAtom)
  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const setPostWork = useCallback((payload: FetchPlaylistDetailRes) => {
    void setPlaylistInfo({
      playId: payload.playId,
      playName: payload.playName
    })
    void setSongLists(payload.songLists)
    if (payload.activeId === 0) {
      void setSongActiveIndex(0)
    } else {
      const index = payload.songLists.findIndex((item) => item.id === payload.activeId)
      const actualIndex = index !== -1 ? index : 0
      void setSongActiveIndex(actualIndex)
      if (actualIndex > 0) {
        void setSongActiveId(payload.activeId)
      }
    }
    setAutoplay(true)
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
    setAutoplay(false)
    setPlayerStatus('none')
    void setProgress(0)
    void setPlaylistInfo({
      playId: 0,
      playName: ''
    })
    void setSongLists([])
    void setSongActiveId(0)
    void setSongActiveIndex(0)
  }, [])

  return {
    clearPlaylists,
    getDefaultPlaylists,
    getCustomPlaylists
  }
}
