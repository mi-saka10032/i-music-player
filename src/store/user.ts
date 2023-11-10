import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getAccountInfo } from '@/api/user'
import { getCookie, clearCookie } from '@/utils'

export interface UserState {
  cookie: string
  accountInfo: AccountInfoRes
}

const initialState: UserState = {
  cookie: getCookie() ?? '',
  accountInfo: { code: 0 }
}

export const fetchAccountInfo = createAsyncThunk(
  'user/getAccountInfoStatus',
  async () => await getAccountInfo()
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCookie (state, action: PayloadAction<string>) {
      const curCookie = action.payload
      state.cookie = curCookie
      if (curCookie.length === 0) {
        clearCookie()
      }
    },
    setAccountInfo (state, action: PayloadAction<AccountInfoRes>) {
      state.accountInfo = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccountInfo.fulfilled, (state, { payload }) => {
      state.accountInfo = payload
    })
  }
})

export const userReducer = userSlice.reducer
export const { setCookie, setAccountInfo } = userSlice.actions
