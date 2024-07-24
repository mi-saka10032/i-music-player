import { atom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { PlayType } from '@/core/player'

export const playTypeAtom = createAtomWithIndexedDB<PlayType>({
  cacheName: 'playType',
  initialValue: PlayType.loop,
  debounceMS: 250
})

export const muteAtom = createAtomWithIndexedDB<boolean>({
  cacheName: 'mute',
  initialValue: false,
  debounceMS: 250
})

export const volumeAtom = createAtomWithIndexedDB<number>({
  cacheName: 'volume',
  initialValue: 60,
  debounceMS: 250
})

export const progressAtom = createAtomWithIndexedDB<number>({
  cacheName: 'progress',
  initialValue: 0,
  throttleMS: 1000
})

export const playerStatusAtom = atom<MediaSessionPlaybackState>('none')
