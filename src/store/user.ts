import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getAccountInfo } from '@/api/user'
import { getCookie } from '@/utils'

interface UserState {
  cookie: string
  accountInfo: AccountInfoRes
  userInfo: any
}

const initialState: UserState = {
  cookie: getCookie() ?? '',
  accountInfo: { code: 0 },
  userInfo: null
}

export const fetchAccountInfo = createAsyncThunk(
  'user/getAccountInfoStatus',
  async () => await getAccountInfo()
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo (state, action: PayloadAction<any>) {
      state.userInfo = action.payload
    },
    setCookie (state, action: PayloadAction<string>) {
      state.cookie = action.payload
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

export const userState = userSlice.getInitialState()
export const userReducer = userSlice.reducer
export const { setUserInfo, setCookie, setAccountInfo } = userSlice.actions
