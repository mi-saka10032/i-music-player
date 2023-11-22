export interface WrapPromise<T> {
  read: () => T | Error | undefined
}

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
