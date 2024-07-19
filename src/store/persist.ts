import { atom } from 'jotai'
import { selectDB, updateDB } from '@/utils/db'

interface PersistParam<T> {
  cacheName: string
  initialValue: T
  debounceMS?: number
}

export const createAtomWithIndexedDB = <T>({ cacheName, initialValue, debounceMS }: PersistParam<T>) => {
  let lock = true

  let initResolver: () => void

  const initPromise = new Promise<void>(resolve => {
    initResolver = resolve
  })

  let timer = 0

  const baseAtom = atom<T>(initialValue)

  const cacheAtom = atom(
    async (get) => get(baseAtom),
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
