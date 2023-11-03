import { getBanners, getPersonalized } from '@/api'
import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'

const initialState = {
  banners: [] as Banners,
  personalizedPlaylist: [] as PlayLists
}

export const fetchRecommendData = createAsyncThunk('cache/fetchRecommendData', async () => {
  const data: typeof initialState = {
    banners: [] as Banners,
    personalizedPlaylist: [] as PlayLists
  }
  const fetchList = [
    getBanners().then(res => data.banners = res.banners),
    getPersonalized().then(res => data.personalizedPlaylist = res.result)
  ]
  await Promise.allSettled(fetchList)
  return data
})

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecommendData.fulfilled, (state, { payload }) => {
      Object.assign(state, payload)
    })
  }
})

export const cacheState = cacheSlice.getInitialState()
export const cacheReducer = cacheSlice.reducer
