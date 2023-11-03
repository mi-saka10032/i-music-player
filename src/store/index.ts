import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { cacheState, cacheReducer } from './cache'
import { userState, userReducer } from './user'
import persist, { setInitialState } from './middleware/persist'
import { INITIAL_STATE_LOADED } from '@/common/constants'

// 初始化state（仅提供typeof类型）
const initialState = {
  user: userState,
  cache: cacheState
}

// 初始化reducers
const configureReducers = combineReducers({
  cache: cacheReducer,
  user: userReducer
})

// 初始化store
const store = configureStore({
  reducer: (state: any, action: { type: string, payload: typeof initialState }) => {
    if (action.type === INITIAL_STATE_LOADED) {
      return action.payload
    } else {
      return configureReducers(state, action)
    }
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persist)
})

// 派发: selectDB -> 初始化state
void store.dispatch(setInitialState())

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store
