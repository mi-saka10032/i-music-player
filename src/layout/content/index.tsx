import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { CONTENT_CONTAINER_ID } from '@/utils'

const Content = memo(() => {
  return (
    <div id={CONTENT_CONTAINER_ID} className="w-full h-full overflow-auto bg-white">
      <div className="max-w-[1096px] mx-auto break-all">
        <Outlet />
      </div>
    </div>
  )
})

Content.displayName = 'Content'
export default Content
