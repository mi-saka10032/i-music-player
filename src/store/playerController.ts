import { atom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { PlayType } from '@/core'

export const PLAY_TYPE_CACHE_NAME = 'playType'

export const playTypeAtom = createAtomWithIndexedDB<PlayType>({
  cacheName: PLAY_TYPE_CACHE_NAME,
  initialValue: PlayType.loop,
  debounceMS: 250
})

export const MUTE_CACHE_NAME = 'mute'

export const muteAtom = createAtomWithIndexedDB<boolean>({
  cacheName: MUTE_CACHE_NAME,
  initialValue: false,
  debounceMS: 250
})

export const VOLUME_CACHE_NAME = 'volume'

export const volumeAtom = createAtomWithIndexedDB<number>({
  cacheName: VOLUME_CACHE_NAME,
  initialValue: 60,
  debounceMS: 250
})

export const PROGRESS_CACHE_NAME = 'progress'

export const progressAtom = createAtomWithIndexedDB<number>({
  cacheName: PROGRESS_CACHE_NAME,
  initialValue: 0,
  throttleMS: 1000
})

export const playerStatusAtom = atom<MediaSessionPlaybackState>('none')
