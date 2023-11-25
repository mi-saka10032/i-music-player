import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface PlayerStatusState {
  // 播放状态
  status: MediaSessionPlaybackState
}

const initialState: PlayerStatusState = {
  status: 'none'
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
    clearPlayerStatus (state, action: PayloadAction) {
      console.log(action)
      state.status = 'none'
    }
  }
})

export const playerStatusReducer = playerStatusSlice.reducer
export const {
  setPlayStatus,
  clearPlayerStatus
} = playerStatusSlice.actions
