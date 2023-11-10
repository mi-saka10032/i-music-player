import { memo, useMemo, useRef, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { setMute, setVolume } from '@/store/playlist'
import ProgressBar from '@/components/core/progressBar'
import { debounce } from 'throttle-debounce'

// 音量控制器，封装原生进度条组件实现
const VolumeController = memo(() => {
  const { playerType } = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()
  // 静音前音量缓存
  const lastVolume = useRef(playerType.volume)
  // 静音切换
  const switchMute = useCallback(() => {
    dispatch(setMute(!playerType.mute))
    if (playerType.mute) {
      dispatch(setVolume(lastVolume.current))
    } else {
      dispatch(setVolume(0))
      lastVolume.current = playerType.volume ?? 10
    }
  }, [playerType.mute, playerType.volume])
  // 进度条设置音量
  const debounceVolume = useCallback(debounce(500, (newPercent: number) => {
    dispatch(setVolume(newPercent))
  }), [])
  const changeVolume = useCallback((newPercent: number) => {
    debounceVolume(newPercent)
  }, [playerType.volume])
  // 音量图标
  const soundIcon = useMemo(() => {
    if (playerType.mute) {
      return 'icon-volume_cross'
    } else if (playerType.volume >= 80) {
      return 'icon-volume_high'
    } else if (playerType.volume >= 40) {
      return 'icon-volume-middle'
    } else if (playerType.volume > 0) {
      return 'icon-volume-low'
    } else {
      return 'icon-volume_zero'
    }
  }, [playerType.mute, playerType.volume])
  return (
    <div className="group/volume relative w-5 h-5 flex justify-center items-center">
      <i
        className={`iconfont ${soundIcon} cursor-pointer`}
        onClick={switchMute}
      ></i>
      <div className="hidden group-hover/volume:inline-block p-4 absolute -top-2 left-2/4 -translate-x-1/2 -translate-y-full bg-white shadow-md rounded">
        <div className="h-20">
          <ProgressBar
            percent={playerType.volume}
            onInput={changeVolume}
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
