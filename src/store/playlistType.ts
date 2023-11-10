// 播放类型
export enum PlayType {
  loop = 'loop',
  single = 'single',
  random = 'random',
  sequential = 'sequential',
}

// 播放事件
export enum PlayerEvent {
  LOAD = 'LOAD',
  LOAD_ERROR = 'LOAD_ERROR',
  PLAY_ERROR = 'PLAY_ERROR',
  PLAY_TYPE_CHANGE = 'PLAY_TYPE_CHANGE',
  VOLUME_CHANGE = 'VOLUME_CHANGE',
  MUTE_CHANGE = 'MUTE_CHANGE',
  PROGRESS_CHANGE = 'PROGRESS_CHANGE',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
  END = 'END',
  SEEK = 'SEEK',
  CHANGE = 'CHANGE',
  PLAYLIST_CHANGE = 'PLAYLIST_CHANGE',
  INDEX_CHANGE = 'INDEX_CHANGE',
  RESET = 'RESET',
  STATUS_CHANGE = 'STATUS_CHANGE',
  DURATION_CHANGE = 'DURATION_CHANGE',
}

export interface PlayerType {
  type: PlayType
  mute: boolean
  volume: number
}

export interface Playlist extends Song {
  howl?: Howl | null
  id: number
  name: string
  artists: AR[]
  album: AL
}

export type Playlists = Playlist[]

// 播放信息与状态
export interface PlayerInstance {
  // 播放状态
  status: MediaSessionPlaybackState
  // 时长
  duration: number
  // 播放进度
  progress: number
}
