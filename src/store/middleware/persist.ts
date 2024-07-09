import type { Middleware } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '@/store'
import { updateDB, selectDB } from '@/utils/db'
import { INITIAL_STATE_LOADED } from '@/common/constants'

interface PersistType {
  type: string
  meta?: {
    requestId: string
    requestStatus: 'pending' | 'fulfilled' | 'rejected'
  }
  payload: any
}

enum KeyList {
  cache = 'cache',
  user = 'user',
  playlist = 'playlist',
  playerStatus = 'playerStatus',
  playerInstance = 'playerInstance',
  playerProgress = 'playerProgress'
}

const keyList = Object.values(KeyList)

function update (key: string, state: any) {
  try {
    void updateDB({ name: key, value: state })
  } catch (error) {
    console.log(error)
  }
}

const persist: Middleware = (store) => (next) => (action: PersistType) => {
  const result = next(action)
  const key = keyList.find(key => action.type.startsWith(`${key}/`))
  if (key != null) {
    if (action?.meta != null) {
      if (action.meta.requestStatus === 'fulfilled') {
        update(key, store.getState()[key])
      }
    } else {
      update(key, store.getState()[key])
    }
  }
  return result
}

export const setInitialState = () => {
  return async function (dispatch: AppDispatch, getState: () => RootState) {
    try {
      const state = getState()
      const cache: RootState = Object.assign({}, state)
      const items = await Promise.allSettled(keyList.map<Promise<[KeyList, any]>>(async name => {
        const value = await selectDB<any>(name)
        return [name, value]
      }))
      for (const item of items) {
        if (item.status === 'fulfilled') {
          const [name, value] = item.value
          if (value != null) {
            cache[name] = Object.assign({}, cache[name], value)
          }
        }
      }
      dispatch({ type: INITIAL_STATE_LOADED, payload: cache })
    } catch (error) {
      console.error('Error loading initial state from indexedDB:', error)
    }
  }
}

export default persist
