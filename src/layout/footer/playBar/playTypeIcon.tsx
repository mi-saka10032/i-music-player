import { memo } from 'react'
import { type PlayType } from '@/core/player'

interface PlayTypeIconProps {
  type: PlayType
  onTypeChange: (type: PlayType) => void
}

// 播放类型组件
const PlayTypeIcon = memo((props: PlayTypeIconProps) => {
  return (
    <div className="flex items-center justify-center">
      <i
        className={`iconfont icon-${props.type} text-ct text-base cursor-pointer`}
        onClick={() => { props.onTypeChange(props.type) }}
      />
    </div>
  )
})

PlayTypeIcon.displayName = 'PlayTypeIcon'
export default PlayTypeIcon
