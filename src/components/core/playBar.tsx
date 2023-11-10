import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { Howl } from 'howler'
import { useAppDispatch, useAppSelector } from '@/hooks'
import ProgressBar from '@/components/core/progressBar'
import PlayTypeIcon from './playTypeIcon'
import VolumeController from '@/components/core/volumeController'
import { setDuration, setPlayStatus, setProgress } from '@/store/playlist'
import PlayIcon from '@/assets/svg/play.svg?react'
import PauseIcon from '@/assets/svg/pause.svg?react'

// 总播放栏组件
const PlayBar = memo(() => {
  const { playlists, playIndex, playerInstance } = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()
  // 当前音乐id
  const activeId = useMemo<number | null>(() => {
    const playlist = playlists[playIndex]
    return playlist != null ? (playlist.id > 0 ? playlist.id : null) : null
  }, [playlists, playIndex])
  // 当前音乐链接
  const activeUrl = useMemo<string | null>(() => {
    const playlist = playlists[playIndex]
    return playlist != null ? (playlist.url?.length > 0 ? playlist.url : null) : null
  }, [playlists, playIndex])
  // 动态播放/暂停图标类名
  const DynamicIcon = useMemo(() => {
    console.log('switch play icon')
    return playerInstance.status === 'playing' ? <PauseIcon className='w-12 h-12' /> : <PlayIcon className='w-12 h-12' />
  }, [playerInstance.status])
  // 播放/暂停切换点击
  const switchPlayStatus = useCallback(() => {
    if (activeId == null || activeUrl == null) {
      return
    }
    if (playerInstance.status === 'playing') {
      dispatch(setPlayStatus('paused'))
    } else {
      dispatch(setPlayStatus('playing'))
    }
  }, [activeId, activeUrl, playerInstance.status])
  // Howl音频对象哈希管理
  const howlMap = useRef<Map<number, Howl>>(new Map())
  const getCurrentHowl = useCallback((): Howl | null => {
    if (activeId == null) {
      return null
    }
    return howlMap.current.get(activeId) ?? null
  }, [activeId])
  const getProgress = useCallback((seekTime: number, duration: number): number => {
    if (duration === 0) return 0
    return Math.max(0, Math.min(100, (seekTime / duration) * 100))
  }, [])
  const getSeekTime = useCallback((percent: number, duration: number) => {
    if (duration === 0) return 0
    return Math.max(0, Math.min(100, percent)) / 100 * duration
  }, [])
  // 更新seekTime 与 percent
  const animationRef = useRef<number>(0)
  function update () {
    const howl = getCurrentHowl()
    if (howl == null) {
      return
    }
    const seekTime = howl.seek() ?? 0
    const duration = howl.duration() ?? 0
    const progress = getProgress(seekTime, duration)
    dispatch(setProgress(progress))
    window.cancelAnimationFrame(animationRef.current)
    if (howl.playing()) {
      animationRef.current = window.requestAnimationFrame(update)
    }
  }
  // 拖拽更新音乐进度
  function updateProgress (percent: number) {
    const howl = getCurrentHowl()
    if (howl == null) {
      return
    }
    const duration = howl.duration() ?? 0
    const seekTime = getSeekTime(percent, duration)
    howl.seek(seekTime)
  }
  // 音乐切换与howl挂载/卸载
  useEffect(() => {
    if (activeId == null || activeUrl == null) {
      return
    }
    if (!howlMap.current.has(activeId)) {
      const howl = new Howl({
        src: [activeUrl],
        html5: true,
        onload: () => {
          // 设置总时长
          const duration = howl.duration() ?? 0
          console.log('总时长', duration)
          dispatch(setDuration(duration))
        },
        onloaderror: () => {
          console.log('音频加载错误')
        }
      })
      howl.on('play', update)
      howl.on('seek', update)
      howlMap.current.set(activeId, howl)
    }
  }, [activeId, activeUrl])
  // 音乐切换与歌曲状态切换
  useEffect(() => {
    const howl = getCurrentHowl()
    console.log(howl)
    if (playerInstance.status === 'playing') {
      // 播放状态是播放 && howl实例处于非播放放态 -> 播放实例
      if (howl?.playing() !== true) {
        howl?.play()
      }
    } else {
      // 播放状态是暂停 && howl实例处于播放放态 -> 暂停实例
      if (howl?.playing() === true) {
        howl?.pause()
      }
    }
  }, [playerInstance.status])
  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full top-0 left-0">
        <ProgressBar key="ProgressBar" percent={playerInstance.progress} onChange={updateProgress} />
      </div>
      <div className="flex space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button>
          <i className="iconfont icon-like_full text-primary text-xl" />
        </button>
        <button>
          <i className="iconfont icon-previous text-primary text-base" />
        </button>
        <button onClick={switchPlayStatus}>
          {DynamicIcon}
        </button>
        <button>
          <i className="iconfont icon-next text-primary text-base"/>
        </button>
        <button>
          <i className="iconfont icon-share text-ct" />
        </button>
      </div>
      <div className="flex space-x-6 absolute right-6 top-1/2 -translate-y-1/2">
        <PlayTypeIcon key="PlayTypeIcon" />
        <i className="iconfont icon-playlist text-ct text-base cursor-pointer" />
        <VolumeController key="VolumeController" />
      </div>
    </div>
  )
})

PlayBar.displayName = 'PlayBar'
export default PlayBar
