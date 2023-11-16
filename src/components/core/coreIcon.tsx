import { memo } from 'react'
import PlayIcon from '@/assets/svg/play.svg?react'
import PauseIcon from '@/assets/svg/pause.svg?react'

interface CoreIconProps {
  className: string
  status: boolean
}

const CoreIcon = memo(({ className, status }: CoreIconProps) => {
  return status ? <PauseIcon className={className} /> : <PlayIcon className={className} />
})

CoreIcon.displayName = 'CoreIcon'
export default CoreIcon
