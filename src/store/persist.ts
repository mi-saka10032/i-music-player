import { atom } from 'jotai'
import { selectDB, updateDB } from '@/utils'

interface PersistParam<T> {
  cacheName: string
  initialValue: T
  debounceMS?: number
  throttleMS?: number
}

export const createAtomWithIndexedDB = <T>({ cacheName, initialValue, debounceMS, throttleMS }: PersistParam<T>) => {
  let lock = true

  let initResolver: () => void

  const initPromise = new Promise<void>(resolve => {
    initResolver = resolve
  })

  let timer = 0

  const baseAtom = atom<T>(initialValue)

  const cacheAtom = atom(
    (get) => get(baseAtom),
    async (_, set, value: T) => {
      lock = false
      await initPromise
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
    void selectDB<T>(cacheName)
      .then((value) => {
        if (lock && value != null) {
          setAtom(value)
        }
      })
      .finally(() => {
        initResolver()
      })
  }

  return cacheAtom
}
