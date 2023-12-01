import { memo, useMemo, useRef, useCallback, useEffect } from 'react'
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
  const volumeRef = useRef<HTMLDivElement>(null)

  // 静音切换
  const switchMute = useCallback(() => {
    if (mute) {
      props.onVolumeChange(lastVolume.current)
    } else {
      props.onVolumeChange(0)
      lastVolume.current = volume > 0 ? volume : 10
    }
    props.onMuteChange(!mute)
  }, [mute, volume])

  // 音量图标
  const soundIcon = useMemo(() => {
    if (mute) {
      return 'icon-volume-cross'
    } else if (volume >= 75) {
      return 'icon-volume-high'
    } else if (volume >= 50) {
      return 'icon-volume-middle'
    } else if (volume >= 25) {
      return 'icon-volume-low'
    } else if (volume > 0) {
      return 'icon-volume-zero'
    } else {
      return 'icon-volume-cross'
    }
  }, [mute, volume])

  // 滚轮事件控制音量变化(±10)
  useEffect(() => {
    function handleScrollVolume (e: WheelEvent) {
      // 滚轮↑为负值 滚轮↓为正值
      const newVolume = (e.deltaY < 0 ? 1 : -1) * 10 + volume
      const realVolume = Math.max(0, Math.min(100, newVolume))
      props.onVolumeChange(realVolume)
    }
    volumeRef.current?.addEventListener('wheel', handleScrollVolume)
    return () => {
      volumeRef.current?.removeEventListener('wheel', handleScrollVolume)
    }
  }, [volume])

  return (
    <div ref={volumeRef} className="group/volume relative w-5 h-5 flex justify-center items-center">
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
