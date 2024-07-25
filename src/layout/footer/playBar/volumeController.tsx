import { memo, useMemo, useRef, useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { muteAtom, volumeAtom } from '@/store'
import ProgressBar from '@/layout/footer/playBar/progressBar'
import { playerInstance } from '@/core/player'

// 音量控制器，封装原生进度条组件实现
const VolumeController = memo(() => {
  const [mute, setMute] = useAtom(muteAtom)

  const [volume, setVolume] = useAtom(volumeAtom)

  // 静音前音量缓存
  const lastVolume = useRef(volume)

  const volumeRef = useRef<HTMLDivElement>(null)

  // 静音切换
  const switchMute = useCallback(() => {
    if (mute) {
      lastVolume.current = lastVolume.current > 0 ? lastVolume.current : 10
      setVolume(lastVolume.current)
    } else {
      lastVolume.current = volume > 0 ? volume : 10
      setVolume(0)
    }
    setMute(!mute)
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
      setVolume(realVolume)
    }
    volumeRef.current?.addEventListener('wheel', handleScrollVolume)
    return () => {
      volumeRef.current?.removeEventListener('wheel', handleScrollVolume)
    }
  }, [volume])

  useEffect(() => {
    playerInstance.setMute(mute)
  }, [mute])

  useEffect(() => {
    playerInstance.setVolume(volume)
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
            onInput={setVolume}
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
