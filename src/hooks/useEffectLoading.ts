import { useEffect, useState } from 'react'

type RequestFn<T> = (param?: T) => Promise<void>

export function useEffectLoading <T> (deps: unknown[], requestFn: RequestFn<T>, param?: T) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    void requestFn(param)
      .catch((error) => { console.log(error) })
      .finally(() => { setLoading(false) })
  }, deps)

  return { loading }
}
