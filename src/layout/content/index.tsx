import { memo } from 'react'
import { Outlet } from 'react-router-dom'

const Content = memo(() => {
  return (
    <div className="relative w-full overflow-auto">
      <div className="h-[50px]"></div>
      <div>
        <div className="max-w-[1096px] mx-auto break-all">
          <Outlet />
        </div>
      </div>
    </div>
  )
})

Content.displayName = 'Content'
export default Content
