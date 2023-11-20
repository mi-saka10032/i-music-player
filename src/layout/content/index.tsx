import { memo } from 'react'
import OverlayScrollbarsComponent from '@/components/overlayscrollbars'
import { Outlet } from 'react-router-dom'

const Content = memo(() => {
  return (
    <OverlayScrollbarsComponent>
      <div className="h-[50px]"></div>
      <div>
        <div className="max-w-[1096px] mx-auto break-all">
          <Outlet />
        </div>
      </div>
    </OverlayScrollbarsComponent>
  )
})

Content.displayName = 'Content'
export default Content
