import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { PlayType } from '@/core/player'

export interface PlayerInstanceState {
  // 循环类型
  playType: PlayType
  // 静音
  mute: boolean
  // 音量
  volume: number
}

const initialState: PlayerInstanceState = {
  playType: PlayType.loop,
  mute: false,
  volume: 60
}

const playerInstanceSlice = createSlice({
  name: 'playerInstance',
  initialState,
  reducers: {
    setPlayType (state, action: PayloadAction<PlayType>) {
      if (state.playType === action.payload) return
      console.log(action)
      state.playType = action.payload
    },
    setMute (state, action: PayloadAction<boolean>) {
      if (state.mute === action.payload) return
      console.log(action)
      state.mute = action.payload
    },
    setVolume (state, action: PayloadAction<number>) {
      if (state.volume === action.payload) return
      console.log(action)
      state.volume = action.payload
    }
  }
})

export const playerInstanceReducer = playerInstanceSlice.reducer
export const {
  setPlayType,
  setMute,
  setVolume
} = playerInstanceSlice.actions
