import { type FC, memo, useMemo, useRef, useState } from 'react'
import ProgressBar from '@/components/progress-bar'

// 音量控制器，封装原生进度条组件实现
const VolumeController: FC = memo(() => {
  const [volume, setVolume] = useState(60)
  const [mute, setMute] = useState(false)
  const icon = useMemo(() => {
    if (mute) {
      return 'icon-volume_cross'
    } else if (volume >= 80) {
      return 'icon-volume_high'
    } else if (volume >= 40) {
      return 'icon-volume-middle'
    } else if (volume > 0) {
      return 'icon-volume-low'
    } else {
      return 'icon-volume_zero'
    }
  }, [mute, volume])
  const lastVolume = useRef(volume)
  function handleClick () {
    setMute(!mute)
    if (mute) {
      setVolume(lastVolume.current)
    } else {
      setVolume(0)
      lastVolume.current = volume ?? 10
    }
  }
  return (
    <div className="group/volume relative w-5 h-5 flex justify-center items-center">
      <i
        className={`iconfont ${icon} cursor-pointer`}
        onClick={handleClick}
      ></i>
      <div className="hidden group-hover/volume:inline-block p-4 absolute -top-2 left-2/4 -translate-x-1/2 -translate-y-full bg-while shadow-md rounded">
        <div className="h-20">
          <ProgressBar
            percent={volume}
            onInput={setVolume}
            barWidth="4px"
            pointSize="10px"
            alwaysPoint
            vertical
            round
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-[6px] border-x-4 divide-solid border-x-[transparent] border-t-while"></div>
      </div>
    </div>
  )
})
VolumeController.displayName = 'VolumeController'
export default VolumeController
