import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface PlayerProgressState {
  // 时长
  duration: number
  // 播放进度
  progress: number
}

const initialState: PlayerProgressState = {
  duration: 0,
  progress: 0
}

const playerProgressSlice = createSlice({
  name: 'playerProgress',
  initialState,
  reducers: {
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
    clearPlayerProgress (state, action: PayloadAction) {
      console.log(action)
      state.duration = 0
      state.progress = 0
    }
  }
})

export const playerProgressReducer = playerProgressSlice.reducer
export const {
  setDuration,
  setProgress,
  clearPlayerProgress
} = playerProgressSlice.actions
