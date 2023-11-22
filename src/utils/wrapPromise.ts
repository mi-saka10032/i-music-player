export interface WrapPromise<T> {
  read: () => T | Error | undefined
}

// Promise包裹函数，用来和Suspense联动
export function wrapPromise <T> (promise: Promise<T>): WrapPromise<T> {
  let status = 'pending'
  let result: T | Error

  promise
    .then((resolve) => {
      status = 'success'
      // T类型
      result = resolve
    })
    .catch((err: Error) => {
      status = 'error'
      // Error类型
      result = err
    })

  return {
    read () {
      if (status === 'pending') {
        throw promise
      } else if (status === 'error') {
        return result
      } else if (status === 'success') {
        return result
      }
    }
  }
}
