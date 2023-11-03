import { useOverlayScrollbars } from './useOverlayScrollbars'
import 'overlayscrollbars/overlayscrollbars.css'

import { type PropsWithChildren, memo, useRef, useEffect } from 'react'

// 优化滚动条包裹组件
const OverlayScrollbarsComponent = memo(({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null)
  const [initialize] = useOverlayScrollbars()

  useEffect(() => {
    if (ref.current != null) {
      initialize(ref.current)
    }
  }, [initialize])

  return (
    <div className="w-full" ref={ref}>
      {children}
    </div>
  )
})

OverlayScrollbarsComponent.displayName = 'OverlayScrollbarsComponent'
export default OverlayScrollbarsComponent
