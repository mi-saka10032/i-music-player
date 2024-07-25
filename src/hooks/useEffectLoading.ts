import { useCallback, useEffect, useState } from 'react'

type RequestFn<T> = (param?: T) => Promise<void>

export function useEffectLoading <T> (deps: unknown[], requestFn: RequestFn<T>, param?: T) {
  const [loading, setLoading] = useState(true)

  const handleRequest = useCallback(async () => {
    setLoading(true)
    try {
      await requestFn(param)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    void handleRequest()
  }, [handleRequest])

  return { loading }
}
