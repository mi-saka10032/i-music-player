import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getPlaylistDetail } from '@/api'
import { type PlayData, PlayType } from '@/core/player'

export interface PlaylistState {
  // 播放列表（不含链接）
  playlists: PlayData[]
  // 播放索引
  playIndex: number
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
}

const initialState: PlaylistState = {
  playlists: [],
  playIndex: 0,
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
  }
}

export const fetchPlaylistDetail = createAsyncThunk('playlist/fetchPlaylistDetail', async (id: number) => {
  const res = await getPlaylistDetail(id)
  return res.playlist.tracks.map(item => ({
    id: item.id,
    name: item.name,
    artists: item.ar,
    album: item.al
  }))
})

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlayType (state, action: PayloadAction<PlayType>) {
      console.log(action)
      state.playerType.type = action.payload
    },
    setMute (state, action: PayloadAction<boolean>) {
      console.log(action)
      state.playerType.mute = action.payload
    },
    setVolume (state, action: PayloadAction<number>) {
      console.log(action)
      state.playerType.volume = action.payload
    },
    setAutoplay (state, action: PayloadAction<boolean>) {
      console.log(action)
      state.playerInstance.autoplay = action.payload
    },
    setPlayStatus (state, action: PayloadAction<MediaSessionPlaybackState>) {
      console.log(action)
      state.playerInstance.status = action.payload
    },
    setDuration (state, action: PayloadAction<number>) {
      console.log(action)
      state.playerInstance.duration = action.payload
    },
    setProgress (state, action: PayloadAction<number>) {
      state.playerInstance.progress = action.payload
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
  setPlayType, setMute, setVolume, setAutoplay, setPlayStatus, setDuration, setProgress
} = playlistSlice.actions
