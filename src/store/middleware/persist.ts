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
  playerInstance = 'playerInstance'
}
interface DBResult {
  id: number
  name: keyof typeof KeyList
  value: string
}
const keyList = Object.values(KeyList)

function update (key: string, state: any) {
  try {
    void updateDB({ name: key, value: JSON.stringify(state) })
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
      void Promise.allSettled(keyList.map(async name => await selectDB<DBResult>(name))).then((res) => {
        res.forEach((item) => {
          if (item.status === 'fulfilled') {
            // item.value是selectDB的真正结果
            const result = item.value
            if (Array.isArray(result) && result.length > 0) {
              const { name, value } = result[0]
              try {
                cache[name] = Object.assign({}, cache[name], JSON.parse(value))
              } catch (error) {
                console.log(error)
              }
            }
          }
        })
        dispatch({ type: INITIAL_STATE_LOADED, payload: cache })
      })
    } catch (error) {
      console.error('Error loading initial state from DB:', error)
    }
  }
}

export default persist
