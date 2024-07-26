import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import {
  type PlaylistInfo,
  playerStatusAtom,
  playlistInfoAtom,
  progressAtom,
  queueLoadingAtom,
  songActiveIdAtom,
  songActiveIndexAtom,
  songListsAtom
} from '@/store'
import { playerInstance, type SongData } from '@/core/player'
import { getJaySongs, getPlaylistDetail, getSongDetail } from '@/api'
import { customSongDataTrans, normalSongDataTrans } from '@/utils'

interface FetchPlaylistDetailRes extends PlaylistInfo {
  songLists: SongData[]
  activeId: number
}

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
    let actualIndex = 0
    if (payload.activeId === 0) {
      setSongActiveIndex(0)
    } else {
      const index = payload.songLists.findIndex((item) => item.id === payload.activeId)
      actualIndex = index !== -1 ? index : 0
      setSongActiveIndex(actualIndex)
      if (actualIndex > 0) {
        setSongActiveId(payload.activeId)
      }
    }
    playerInstance.setPlaylist(payload.songLists, actualIndex, true)
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
    playerInstance.reset()
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
