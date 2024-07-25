import { atom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { PlayType } from '@/core/player'

export const PLAY_TYPE_CACHE_NAME = 'playType'

export const playTypeAtom = createAtomWithIndexedDB<PlayType>({
  enableInitialCache: true,
  cacheName: PLAY_TYPE_CACHE_NAME,
  initialValue: PlayType.loop,
  debounceMS: 250
})

export const MUTE_CACHE_NAME = 'mute'

export const muteAtom = createAtomWithIndexedDB<boolean>({
  cacheName: MUTE_CACHE_NAME,
  enableInitialCache: true,
  initialValue: false,
  debounceMS: 250
})

export const VOLUME_CACHE_NAME = 'volume'

export const volumeAtom = createAtomWithIndexedDB<number>({
  cacheName: VOLUME_CACHE_NAME,
  enableInitialCache: true,
  initialValue: 60,
  debounceMS: 250
})

export const PROGRESS_CACHE_NAME = 'progress'

export const progressAtom = createAtomWithIndexedDB<number>({
  cacheName: PROGRESS_CACHE_NAME,
  enableInitialCache: true,
  initialValue: 0,
  throttleMS: 1000
})

export const playerStatusAtom = atom<MediaSessionPlaybackState>('none')
