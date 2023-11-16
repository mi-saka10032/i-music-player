import { type ForwardRefExoticComponent, type RefAttributes, memo, forwardRef } from 'react'
import PlayBar from '@/components/core/playBar'

const Footer: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>> = memo(
  forwardRef((_, ref) => {
    return (
      <div ref={ref} className="relative z-20 w-full h-full col-start-1 col-end-3 bg-white">
        <PlayBar />
      </div>
    )
  })
)

Footer.displayName = 'Footer'
export default Footer
