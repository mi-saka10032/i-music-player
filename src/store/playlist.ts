import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getPlaylistDetail, getSongUrl } from '@/api'
import {
  PlayType,
  type PlayerType,
  type PlayerInstance,
  type Playlists
} from './playlistType'

export interface PlaylistState {
  // 播放列表（不含链接）
  playlists: Playlists
  // 播放索引
  playIndex: number
  // 播放器设置
  playerType: PlayerType
  // 播放实例
  playerInstance: PlayerInstance
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
    status: 'none',
    duration: 0,
    progress: 0
  }
}

export const fetchPlaylistDetail = createAsyncThunk('playlist/fetchPlaylistDetail', async ({ id, autoplay }: { id: number, autoplay: boolean }) => {
  const res = await getPlaylistDetail(id)
  const playlists: Playlists = res.playlist.tracks.map(item => ({
    id: item.id,
    name: item.name,
    artists: item.ar,
    album: item.al,
    url: '',
    time: 0
  }))
  // 自动播放-获取第一首曲目的url和duration信息
  if (autoplay && playlists.length > 0) {
    const urls: SongRes = await getSongUrl(playlists[0].id)
    if (urls.data?.length > 0) {
      const { url, time } = urls.data[0]
      playlists[0].url = url
      playlists[0].time = time
    }
  }
  return playlists
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
export const { setPlayType, setMute, setVolume, setPlayStatus, setDuration, setProgress } = playlistSlice.actions
