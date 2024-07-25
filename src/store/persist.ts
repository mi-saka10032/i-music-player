import { atom } from 'jotai'
import { updateDB } from '@/utils'

interface PersistParam<T> {
  cacheName: string
  initialValue: T
  debounceMS?: number
  throttleMS?: number
}

export const createAtomWithIndexedDB = <T>({ cacheName, initialValue, debounceMS, throttleMS }: PersistParam<T>) => {
  let timer = 0

  const baseAtom = atom<T>(initialValue)

  const cacheAtom = atom(
    (get) => get(baseAtom),
    (_, set, value: T) => {
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

  return cacheAtom
}
