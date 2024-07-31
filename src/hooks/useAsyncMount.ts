import { useEffect, useState } from 'react'

type MountFn<T> = (param?: T) => Promise<void>

export function useAsyncMount <T> (asyncMountFn: MountFn<T>, param?: T) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void asyncMountFn(param).finally(() => { setLoading(false) })
  }, [])

  return { loading }
}
