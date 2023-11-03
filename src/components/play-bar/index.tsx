import { type FC, memo, useState } from 'react'
import ProgressBar from '@/components/progress-bar'
import VolumeController from '@/components/volume-controller'

enum PlayType {
  loop = 'loop',
  single = 'single',
  random = 'random',
  sequential = 'sequential',
}
interface PlayTypeProps {
  type?: PlayType
  onChange?: (type: PlayType) => void
}
const playTypeList: PlayType[] = [
  PlayType.loop,
  PlayType.single,
  PlayType.random,
  PlayType.sequential
]
// 播放类型组件
const PlayTypeIcon: FC<PlayTypeProps> = memo(
  ({ type = PlayType.loop, onChange = () => {} }: PlayTypeProps) => {
    const [playType, setPlayType] = useState(type)
    function handleClick () {
      const index = playTypeList.findIndex((item) => item === playType)
      const newType = playTypeList[index + 1] ?? playTypeList[0]
      setPlayType(newType)
      onChange(newType)
    }

    return (
      <div className="flex items-center justify-center">
        <i
          className={`iconfont icon-${playType} text-ct text-base cursor-pointer`}
          onClick={handleClick}
        ></i>
      </div>
    )
  }
)
PlayTypeIcon.displayName = 'PlayTypeIcon'

// 总播放栏组件
const PlayBar = memo(() => {
  const [percent, setPercent] = useState(0)
  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full top-0 left-0">
        <ProgressBar percent={percent} onChange={setPercent} />
      </div>
      <div className="flex space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button>
          <i className="iconfont icon-like_full text-primary text-xl"></i>
        </button>
        <button>
          <i className="iconfont icon-previous text-primary text-base"></i>
        </button>
        <button>
          <i className="iconfont icon-play text-primary text-5xl cursor-pointer"></i>
        </button>
        <button>
          <i className="iconfont icon-next text-primary text-base"></i>
        </button>
        <button>
          <i className="iconfont icon-share text-ct"></i>
        </button>
      </div>
      <div className="flex space-x-6 absolute right-6 top-1/2 -translate-y-1/2">
        <PlayTypeIcon />
        <i className="iconfont icon-playlist text-ct text-base cursor-pointer"></i>
        <VolumeController />
      </div>
    </div>
  )
})

PlayBar.displayName = 'PlayBar'
export default PlayBar
