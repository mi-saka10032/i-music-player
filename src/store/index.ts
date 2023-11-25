import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { type CacheState, cacheReducer } from './cache'
import { type UserState, userReducer } from './user'
import { type PlaylistState, playlistReducer } from './playlist'
import { type PlayerInstanceState, playerInstanceReducer } from './playerInstance'
import { type PlayerStatusState, playerStatusReducer } from './playerStatus'
import { type PlayerProgressState, playerProgressReducer } from './playerProgress'
import persist, { setInitialState } from './middleware/persist'
import { INITIAL_STATE_LOADED } from '@/common/constants'

interface InitialState {
  user: UserState
  cache: CacheState
  playlist: PlaylistState
  playerInstance: PlayerInstanceState
  playerStatus: PlayerStatusState
  playerProgress: PlayerProgressState
}

// 初始化reducers
const configureReducers = combineReducers({
  cache: cacheReducer,
  user: userReducer,
  playlist: playlistReducer,
  playerInstance: playerInstanceReducer,
  playerStatus: playerStatusReducer,
  playerProgress: playerProgressReducer
})

// 初始化store
const store = configureStore({
  reducer: (state: any, action: { type: string, payload: InitialState }) => {
    if (action.type === INITIAL_STATE_LOADED) {
      console.log('INITIAL DB↓')
      // 初始化的播放状态必须是none 禁自动播放
      if (action.payload.playlist != null) {
        action.payload.playlist = {
          ...action.payload.playlist,
          autoplay: false
        }
        action.payload.playerStatus = { status: 'none' }
      }
      console.log(action.payload)
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
