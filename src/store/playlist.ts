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
  // 歌单id
  playlistId: number
  // 歌单name
  playlistName: string
  // 歌单loading
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
  playlistId: 0,
  playlistName: '',
  playlistLoading: false
}

interface FetchPlaylistDetailRes {
  playlistId: number
  playlistName: string
  playlists: SongData[]
}

export const fetchPlaylistDetail = createAsyncThunk('playlist/fetchPlaylistDetail', async (id: number): Promise<FetchPlaylistDetailRes> => {
  const result = await getPlaylistDetail(id)
  return {
    playlistId: result.playlist.id,
    playlistName: result.playlist.name,
    playlists: result.playlist.tracks.map(item => ({
      id: item.id,
      name: item.name,
      artists: item.ar,
      album: item.al,
      time: item.dt
    }))
  }
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
      // console.log(action)
      state.playerInstance.progress = action.payload
    },
    setLoading (state, action: PayloadAction<boolean>) {
      if (state.playlistLoading === action.payload) return
      console.log(action)
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
    },
    setPlaylists (state, action: PayloadAction<SongData[]>) {
      if (state.playlists === action.payload || action.payload?.length === 0) return
      console.log(action)
      state.playlists = action.payload
    },
    setPlaylistId (state, action: PayloadAction<number>) {
      if (state.playlistId === action.payload) return
      console.log(action)
      state.playlistId = action.payload
    },
    setPlaylistName (state, action: PayloadAction<string>) {
      if (state.playlistName === action.payload) return
      console.log(action)
      state.playlistName = action.payload
    },
    clearPlaylists (state, action: PayloadAction) {
      console.log(action)
      state.playlists = []
      state.playIndex = 0
      state.playId = 0
      state.playerInstance = {
        autoplay: false,
        status: 'none',
        duration: 0,
        progress: 0
      }
      state.playlistId = 0
      state.playlistName = ''
      state.playlistLoading = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlaylistDetail.fulfilled, (state, { payload }) => {
      console.log('set playlists', payload)
      state.playlistId = payload.playlistId
      state.playlistName = payload.playlistName
      state.playlists = payload.playlists
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
  setPlayIndex,
  setPlaylists,
  setPlaylistId,
  setPlaylistName,
  clearPlaylists
} = playlistSlice.actions
