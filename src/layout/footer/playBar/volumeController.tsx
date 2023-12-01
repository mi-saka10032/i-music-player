import { memo, useMemo, useRef, useCallback } from 'react'
import ProgressBar from '@/layout/footer/playBar/progressBar'

interface VolumeControllerProps {
  mute: boolean
  volume: number
  onMuteChange: (mute: boolean) => void
  onVolumeChange: (progress: number) => void
}

// 音量控制器，封装原生进度条组件实现
const VolumeController = memo((props: VolumeControllerProps) => {
  const { mute, volume } = props

  // 静音前音量缓存
  const lastVolume = useRef(volume)

  // 静音切换
  const switchMute = useCallback(() => {
    if (mute) {
      props.onVolumeChange(lastVolume.current)
    } else {
      props.onVolumeChange(0)
      lastVolume.current = volume ?? 10
    }
    props.onMuteChange(!mute)
  }, [mute, volume])

  // 音量图标
  const soundIcon = useMemo(() => {
    if (mute) {
      return 'icon-volume-cross'
    } else if (volume >= 66) {
      return 'icon-volume-high'
    } else if (volume >= 33) {
      return 'icon-volume-middle'
    } else if (volume > 0) {
      return 'icon-volume-low'
    } else {
      return 'icon-volume-zero'
    }
  }, [mute, volume])

  return (
    <div className="group/volume relative w-5 h-5 flex justify-center items-center">
      <i
        className={`iconfont ${soundIcon} text-xl text-gc cursor-pointer`}
        onClick={switchMute}
      ></i>
      <div className="hidden group-hover/volume:inline-block group-active/volume:inline-block p-4 absolute -top-2 left-2/4 -translate-x-1/2 -translate-y-full bg-white shadow-md rounded">
        <div className="h-20">
          <ProgressBar
            percent={volume}
            onInput={props.onVolumeChange}
            barWidth="4px"
            pointSize="10px"
            alwaysPoint
            vertical
            round
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-[6px] border-x-4 divide-solid border-x-[transparent] border-t-white"></div>
      </div>
    </div>
  )
})

VolumeController.displayName = 'VolumeController'
export default VolumeController
