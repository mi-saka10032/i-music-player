import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { CONTENT_CONTAINER_ID } from '@/utils/constant'

const Content = memo(() => {
  return (
    <div id={CONTENT_CONTAINER_ID} className="mt-[50px] w-full overflow-auto bg-white">
      <div className="max-w-[1096px] mx-auto break-all">
        <Outlet />
      </div>
    </div>
  )
})

Content.displayName = 'Content'
export default Content
