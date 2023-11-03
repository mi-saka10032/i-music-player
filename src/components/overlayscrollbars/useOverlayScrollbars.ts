import { useEffect, useMemo, useRef } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'

type Defer = () => [
  (
    callback: IdleRequestCallback & FrameRequestCallback,
    options: object
  ) => void,
  () => void
]

// 借助requestAnimationFrame和requestIdleCallback创建刷帧滚动函数
const createDefer: Defer = () => {
  /* c8 ignore start */
  if (typeof window === 'undefined') {
    // mock ssr calls with "noop"
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {}
    return [noop, noop]
  }
  /* c8 ignore end */

  let idleId: number
  let rafId: number
  const idleSupported = typeof window.requestIdleCallback === 'function'
  const rAF = window.requestAnimationFrame
  const cAF = window.cancelAnimationFrame
  const rIdle = idleSupported ? window.requestIdleCallback : rAF
  const cIdle = idleSupported ? window.cancelIdleCallback : cAF
  const clear = () => {
    cIdle(idleId)
    cAF(rafId)
  }

  return [
    (callback, options) => {
      clear()
      idleId = rIdle(
        idleSupported
          ? () => {
              clear()
              // inside idle its best practice to use rAF to change DOM for best performance
              rafId = rAF(callback)
            }
          : callback,
        typeof options === 'object' ? options : { timeout: 2233 }
      )
    },
    clear
  ]
}

/**
 * Hook for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param params Parameters for customization.
 * @returns A tuple with two values:
 * The first value is the initialization function, it takes one argument which is the `InitializationTarget`.
 * The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.
 */
export const useOverlayScrollbars = (params?: any) => {
  const { options, events, defer } = params ?? {}
  const [requestDefer, cancelDefer] = useMemo(createDefer, [])
  const instanceRef = useRef<any>(null)
  // 该项目中以下三个ref对象均不使用，均为undefined
  const deferRef = useRef(defer)
  const optionsRef = useRef(options)
  const eventsRef = useRef(events)

  useEffect(() => {
    deferRef.current = defer
  }, [defer])

  useEffect(() => {
    const { current: instance } = instanceRef
    optionsRef.current = options
    if (OverlayScrollbars.valid(instance)) {
      instance.options(options ?? {}, true)
    }
  }, [options])

  useEffect(() => {
    const { current: instance } = instanceRef

    eventsRef.current = events

    if (OverlayScrollbars.valid(instance)) {
      instance.on(events ?? {}, true)
    }
  }, [events])

  useEffect(
    () => () => {
      cancelDefer()
      instanceRef.current?.destroy()
    },
    []
  )

  // 初始化滚动条事件与样式
  return useMemo(
    () => [
      (target: HTMLElement) => {
        // if already initialized do nothing
        const presentInstance = instanceRef.current
        if (OverlayScrollbars.valid(presentInstance)) {
          return
        }
        const currDefer = deferRef.current
        const currOptions = optionsRef.current ?? {}
        const currEvents = eventsRef.current ?? {}
        const init = () =>
          (instanceRef.current = OverlayScrollbars(
            target,
            currOptions,
            currEvents
          ))
        if (currDefer != null) {
          requestDefer(init, currDefer)
        } else {
          init()
        }
      },
      () => instanceRef.current
    ],
    []
  )
}
