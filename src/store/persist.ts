import { atom } from 'jotai'
import { selectDB, updateDB } from '@/utils'

interface PersistParam<T> {
  cacheName: string
  enableInitialCache: boolean
  initialValue: T
  debounceMS?: number
  throttleMS?: number
}

export const createAtomWithIndexedDB = <T>({ enableInitialCache, cacheName, initialValue, debounceMS, throttleMS }: PersistParam<T>) => {
  let lock = true

  let timer = 0

  const baseAtom = atom<T>(initialValue)

  const cacheAtom = atom(
    (get) => get(baseAtom),
    (_, set, value: T) => {
      if (lock) return

      set(baseAtom, value)

      if (debounceMS != null && debounceMS > 0) {
        window.clearTimeout(timer)
        timer = window.setTimeout(() => {
          void updateDB({ name: cacheName, value })
          timer = 0
        }, debounceMS)
      } else if (throttleMS != null && throttleMS > 0 && timer === 0) {
        timer = window.setTimeout(() => {
          void updateDB({ name: cacheName, value })
          timer = 0
        }, throttleMS)
      } else {
        void updateDB({ name: cacheName, value })
      }
    }
  )

  baseAtom.onMount = (setAtom) => {
    if (!enableInitialCache) {
      lock = false
      return
    }

    void selectDB<T>(cacheName)
      .then((value) => {
        if (value != null) {
          setAtom(value)
        }
      })
      .finally(() => {
        lock = false
      })
  }

  return cacheAtom
}
