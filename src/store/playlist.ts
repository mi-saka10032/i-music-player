import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getPlaylistDetail, getSongDetail } from '@/api'
import { getJaySongs } from '@/api/jay'
import { type SongData } from '@/core/player'
import { normalSongDataTrans, customSongDataTrans } from '@/utils/formatter'

export interface PlaylistState {
  // 右边栏loading
  playlistLoading: boolean
  // 播放开关
  autoplay: boolean
  // 歌单id
  playlistId: number
  // 歌单name
  playlistName: string
  // 播放列表（不含链接）
  playlists: SongData[]
  // 歌曲索引
  activeIndex: number
  // 歌曲id
  activeId: number
}

const initialState: PlaylistState = {
  playlistLoading: false,
  autoplay: false,
  playlistId: 0,
  playlistName: '',
  playlists: [],
  activeIndex: 0,
  activeId: 0
}

interface FetchPlaylistDetailRes {
  playlistId: number
  playlistName: string
  playlists: SongData[]
  activeId: number
}

export const fetchPlaylistDetail = createAsyncThunk('playlist/fetchPlaylistDetail',
  async ({ playlistId, songId }: { playlistId: number, songId: number }): Promise<FetchPlaylistDetailRes> => {
    const result = await getPlaylistDetail(playlistId)
    // 遍历trackIds获取完整id，再拉取一次全量歌曲信息
    const allIds = result.playlist.trackIds.map(item => item.id)
    const completeSongs = await getSongDetail(allIds)
    return {
      playlistId: result.playlist.id,
      playlistName: result.playlist.name,
      playlists: normalSongDataTrans(completeSongs),
      activeId: songId
    }
  })

export const fetchJayPlaylistDetail = createAsyncThunk('playlist/fetchJayPlaylistDetail',
  async (songId: number): Promise<FetchPlaylistDetailRes> => {
    const { customId, customName, list } = await getJaySongs()
    return {
      playlistId: customId,
      playlistName: customName,
      playlists: customSongDataTrans(list),
      activeId: songId
    }
  })

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setAutoplay (state, action: PayloadAction<boolean>) {
      if (state.autoplay === action.payload) return
      console.log(action)
      state.autoplay = action.payload
    },
    setLoading (state, action: PayloadAction<boolean>) {
      if (state.playlistLoading === action.payload) return
      console.log(action)
      state.playlistLoading = action.payload
    },
    setActiveId (state, action: PayloadAction<number>) {
      if (state.activeId === action.payload) return
      console.log(action)
      state.activeId = action.payload
    },
    setActiveIndex (state, action: PayloadAction<number>) {
      if (state.activeIndex === action.payload) return
      console.log(action)
      state.activeIndex = action.payload
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
      state.playlistLoading = false
      state.autoplay = false
      state.playlistId = 0
      state.playlistName = ''
      state.playlists = []
      state.activeIndex = 0
      state.activeId = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistDetail.fulfilled, (state, { payload }) => {
        console.log('set playlists', payload)
        state.playlistLoading = false
        state.playlistId = payload.playlistId
        state.playlistName = payload.playlistName
        state.playlists = payload.playlists
        if (payload.activeId === 0) {
          state.activeIndex = 0
        } else {
          const activeIndex = payload.playlists.findIndex(item => item.id === payload.activeId)
          state.activeIndex = activeIndex !== -1 ? activeIndex : 0
        }
      })
      .addCase(fetchJayPlaylistDetail.fulfilled, (state, { payload }) => {
        console.log('set jay playlists', payload)
        state.playlistLoading = false
        state.playlistId = payload.playlistId
        state.playlistName = payload.playlistName
        state.playlists = payload.playlists
        if (payload.activeId === 0) {
          state.activeIndex = 0
        } else {
          const activeIndex = payload.playlists.findIndex(item => item.id === payload.activeId)
          state.activeIndex = activeIndex !== -1 ? activeIndex : 0
        }
      })
  }
})

export const playlistReducer = playlistSlice.reducer
export const {
  setAutoplay,
  setLoading,
  setPlaylists,
  setPlaylistId,
  setPlaylistName,
  clearPlaylists,
  setActiveId,
  setActiveIndex
} = playlistSlice.actions
