import { type EventType } from 'mitt'

export enum PlayType {
  loop = 'loop',
  single = 'single',
  shuffle = 'shuffle',
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

export interface InitState {
  playlist: SongData[]
  playId: number
  index: number
  autoplay: boolean
  volume: number
  mute: boolean
  repeatMode: PlayType
}

export type ListState = Pick<InitState, 'playlist' | 'playId' | 'index' | 'autoplay'>

export interface SongOption {
  duration: number
  hires: string
  standard: string
}
