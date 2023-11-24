import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface PlayerStatusState {
  // 播放状态
  status: MediaSessionPlaybackState
  // 时长
  duration: number
  // 播放进度
  progress: number
}

const initialState: PlayerStatusState = {
  status: 'none',
  duration: 0,
  progress: 0
}

const playerStatusSlice = createSlice({
  name: 'playerStatus',
  initialState,
  reducers: {
    setPlayStatus (state, action: PayloadAction<MediaSessionPlaybackState>) {
      if (state.status === action.payload) return
      console.log(action)
      state.status = action.payload
    },
    setDuration (state, action: PayloadAction<number>) {
      if (state.duration === action.payload) return
      console.log(action)
      state.duration = action.payload
    },
    setProgress (state, action: PayloadAction<number>) {
      if (state.progress === action.payload) return
      // console.log(action)
      state.progress = action.payload
    },
    clearPlayerStatus (state, action: PayloadAction) {
      console.log(action)
      state.status = 'none'
      state.duration = 0
      state.progress = 0
    }
  }
})

export const playerStatusReducer = playerStatusSlice.reducer
export const {
  setPlayStatus,
  setDuration,
  setProgress,
  clearPlayerStatus
} = playerStatusSlice.actions
