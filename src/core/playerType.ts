import { type EventType } from 'mitt'

export enum PlayType {
  loop = 'loop',
  single = 'single',
  random = 'random',
  sequential = 'sequential',
}

export enum PlayerEvent {
  LOAD = 'LOAD',
  LOAD_ERROR = 'LOAD_ERROR',
  PLAY_ERROR = 'PLAY_ERROR',
  PLAY_TYPE_CHANGE = 'PLAY_TYPE_CHANGE',
  VOLUME_CHANGE = 'VOLUME_CHANGE',
  MUTE_CHANGE = 'MUTE_CHANGE',
  PROGRESS_CHANGE = 'PROGRESS_CHANGE',
  INVALID = 'INVALID',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
  END = 'END',
  SEEK = 'SEEK',
  CHANGE = 'CHANGE',
  PLAYLIST_CHANGE = 'PLAYLIST_CHANGE',
  INDEX_CHANGE = 'INDEX_CHANGE',
  ID_CHANGE = 'ID_CHANGE',
  RESET = 'RESET',
  STATUS_CHANGE = 'STATUS_CHANGE',
  DURATION_CHANGE = 'DURATION_CHANGE',
}

export interface MittEvents<T> extends Record<EventType, unknown> {
  LOAD: unknown
  LOAD_ERROR: unknown
  PLAY_ERROR: unknown
  PLAY_TYPE_CHANGE: PlayType
  VOLUME_CHANGE: number
  MUTE_CHANGE: boolean
  PROGRESS_CHANGE: number
  INVALID: PlayerState
  PLAY: PlayerState
  PAUSE: PlayerState
  STOP: PlayerState
  END: PlayerState
  SEEK: PlayerState
  CHANGE: PlayerState
  PLAYLIST_CHANGE: SongData[]
  INDEX_CHANGE: number
  ID_CHANGE: number
  RESET: T
  STATUS_CHANGE: MediaSessionPlaybackState
  DURATION_CHANGE: number
}

export interface PlayerState {
  id: number
  howl: Howl | null
  repeatMode: PlayType
  mute: boolean
  volume: number
  status: MediaSessionPlaybackState
  duration: number
  progress: number
}

export interface PlayData {
  id: number
  name: string
  artists: AR[]
  album: AL
}

export interface SongData extends PlayData {
  url?: string
  /** time (ms) */
  time?: number
  howl?: Howl | null
}
