import PlayBar from '@/components/core/playBar'
import { memo } from 'react'

const Footer = memo(() => {
  return (
    <div className="w-full h-full col-start-1 col-end-3 ">
      <PlayBar />
    </div>
  )
})

Footer.displayName = 'Footer'
export default Footer
