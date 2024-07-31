import { useEffect, useState } from 'react'

type AsyncFn<T, U> = (param?: T) => Promise<U>

export function useAsyncFn <T, U> (asyncFn: AsyncFn<T, U>, initialValue: U, param?: T) {
  const [data, setData] = useState<U>(initialValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isCanceled = false
    setLoading(true)

    void asyncFn(param)
      .then((data) => {
        if (!isCanceled) {
          setData(data)
        }
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      isCanceled = true
    }
  }, [asyncFn])

  return { data, loading }
}
