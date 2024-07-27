import { atom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'

export interface PlaylistInfo {
  playId: number
  playName: string
}

export const PLAYLIST_INFO_CACHE_NAME = 'playlistInfo'

export const playlistInfoAtom = createAtomWithIndexedDB<PlaylistInfo>({
  cacheName: PLAYLIST_INFO_CACHE_NAME,
  initialValue: {
    playId: 0,
    playName: ''
  }
})

export const SONG_LISTS_CACHE_NAME = 'songLists'

export const songListsAtom = createAtomWithIndexedDB<SongData[]>({
  cacheName: SONG_LISTS_CACHE_NAME,
  initialValue: []
})

export const SONG_ACTIVE_ID_CACHE_NAME = 'songActiveId'

export const songActiveIdAtom = createAtomWithIndexedDB<number>({
  cacheName: SONG_ACTIVE_ID_CACHE_NAME,
  initialValue: 0
})

export const SONG_ACTIVE_INDEX_CACHE_NAME = 'songActiveIndex'

export const songActiveIndexAtom = createAtomWithIndexedDB<number>({
  cacheName: SONG_ACTIVE_INDEX_CACHE_NAME,
  initialValue: 0
})

export const queueLoadingAtom = atom(false)
