import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getPlaylistDetail } from '@/api'
import { type SongData, PlayType } from '@/core/player'

export interface PlaylistState {
  // 播放列表（不含链接）
  playlists: SongData[]
  // 歌曲索引
  playIndex: number
  // 歌曲id
  playId: number
  // 播放器设置
  playerType: {
    // 循环类型
    type: PlayType
    // 静音
    mute: boolean
    // 音量
    volume: number
  }
  // 播放实例
  playerInstance: {
    autoplay: boolean
    // 播放状态
    status: MediaSessionPlaybackState
    // 时长
    duration: number
    // 播放进度
    progress: number
  }
  playlistLoading: boolean
}

const initialState: PlaylistState = {
  playlists: [],
  playIndex: 0,
  playId: 0,
  playerType: {
    type: PlayType.loop,
    mute: false,
    volume: 60
  },
  playerInstance: {
    autoplay: false,
    status: 'none',
    duration: 0,
    progress: 0
  },
  playlistLoading: false
}

export const fetchPlaylistDetail = createAsyncThunk('playlist/fetchPlaylistDetail', async (id: number): Promise<SongData[]> => {
  const result = await getPlaylistDetail(id)
  return result.playlist.tracks.map(item => ({
    id: item.id,
    name: item.name,
    artists: item.ar,
    album: item.al,
    time: item.dt
  }))
})

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlayType (state, action: PayloadAction<PlayType>) {
      if (state.playerType.type === action.payload) return
      console.log(action)
      state.playerType.type = action.payload
    },
    setMute (state, action: PayloadAction<boolean>) {
      if (state.playerType.mute === action.payload) return
      console.log(action)
      state.playerType.mute = action.payload
    },
    setVolume (state, action: PayloadAction<number>) {
      if (state.playerType.volume === action.payload) return
      console.log(action)
      state.playerType.volume = action.payload
    },
    setAutoplay (state, action: PayloadAction<boolean>) {
      if (state.playerInstance.autoplay === action.payload) return
      console.log(action)
      state.playerInstance.autoplay = action.payload
    },
    setPlayStatus (state, action: PayloadAction<MediaSessionPlaybackState>) {
      if (state.playerInstance.status === action.payload) return
      console.log(action)
      state.playerInstance.status = action.payload
    },
    setDuration (state, action: PayloadAction<number>) {
      if (state.playerInstance.duration === action.payload) return
      console.log(action)
      state.playerInstance.duration = action.payload
    },
    setProgress (state, action: PayloadAction<number>) {
      if (state.playerInstance.progress === action.payload) return
      console.log(action)
      state.playerInstance.progress = action.payload
    },
    setLoading (state, action: PayloadAction<boolean>) {
      if (state.playlistLoading === action.payload) return
      state.playlistLoading = action.payload
    },
    setPlayId (state, action: PayloadAction<number>) {
      if (state.playId === action.payload) return
      console.log(action)
      state.playId = action.payload
    },
    setPlayIndex (state, action: PayloadAction<number>) {
      if (state.playIndex === action.payload) return
      console.log(action)
      state.playIndex = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlaylistDetail.fulfilled, (state, { payload }) => {
      state.playlists = payload
    })
  }
})

export const playlistReducer = playlistSlice.reducer
export const {
  setPlayType,
  setMute,
  setVolume,
  setAutoplay,
  setPlayStatus,
  setDuration,
  setProgress,
  setLoading,
  setPlayId,
  setPlayIndex
} = playlistSlice.actions
