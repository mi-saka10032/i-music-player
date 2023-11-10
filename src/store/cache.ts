import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBanners, getPersonalized, getRecommendResource } from '@/api'
import { getCookie } from '@/utils'

export interface CacheState {
  banners: Banners
  personalizedPlaylist: PersonalLists
  recommendList: ResourceLists
}

const initialState: CacheState = {
  banners: [],
  personalizedPlaylist: [],
  recommendList: []
}

export const fetchRecommendData = createAsyncThunk('cache/fetchRecommendData', async () => {
  const data: CacheState = {
    banners: [],
    personalizedPlaylist: [],
    recommendList: []
  }
  const fetchList: Array<Promise<any>> = [getBanners().then(res => data.banners = res.banners)]
  if (getCookie().length > 0) {
    fetchList.push(getRecommendResource().then(res => data.recommendList = res.recommend?.slice(0, 10)))
  } else {
    fetchList.push(getPersonalized().then(res => data.personalizedPlaylist = res.result?.slice(0, 10)))
  }
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

export const cacheReducer = cacheSlice.reducer
