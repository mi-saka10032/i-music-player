import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { type Handler } from 'mitt'
import player, { PlayerEvent, type PlayerState } from '@/core/player'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { setPlayStatus, setProgress } from '@/store/playlist'
import ProgressBar from '@/components/core/progressBar'
import PlayTypeIcon from '@/components/core/playTypeIcon'
import VolumeController from '@/components/core/volumeController'
import PlayIcon from '@/assets/svg/play.svg?react'
import PauseIcon from '@/assets/svg/pause.svg?react'

// 总播放栏组件
const PlayBar = memo(() => {
  const { playlists, playerInstance } = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()
  // 动态图标
  const DynamicIcon = useMemo(() => {
    return playerInstance.status === 'playing' ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />
  }, [playerInstance.status])
  // 生命周期内仅维持一份player实例
  const playerRef = useRef(player)
  // 手动调用实例播放/暂停
  const changeStatus = useCallback(() => {
    if (playerInstance.status === 'playing') {
      playerRef.current.pause()
    } else {
      playerRef.current.play()
    }
  }, [playerInstance.status, playerRef.current])
  // 真正地切换播放/暂停监听回调
  const switchStatus: Handler<PlayerState> = useCallback((state) => {
    dispatch(setPlayStatus(state.status))
  }, [])
  // 手动调用实例跳进度
  const changeProgress = useCallback((progress: number) => {
    playerRef.current.progressTo(progress)
  }, [playerRef.current])
  // 自动更新进度
  const updateProgress: Handler<number> = useCallback((progress) => {
    dispatch(setProgress(progress))
  }, [])
  // 跳转维持播放/暂停状态
  const handleSeek: Handler<PlayerState> = useCallback((state) => {
    console.log(state)
  }, [playerRef.current])
  // 自动更新进度条
  // 全局Player事件监听
  useEffect(() => {
    playerRef.current.on(PlayerEvent.PLAY, switchStatus)
    playerRef.current.on(PlayerEvent.PAUSE, switchStatus)
    playerRef.current.on(PlayerEvent.STOP, switchStatus)
    playerRef.current.on(PlayerEvent.PROGRESS_CHANGE, updateProgress)
    playerRef.current.on(PlayerEvent.SEEK, handleSeek)
    return () => {
      playerRef.current.off(PlayerEvent.PLAY, switchStatus)
      playerRef.current.off(PlayerEvent.PAUSE, switchStatus)
      playerRef.current.off(PlayerEvent.STOP, switchStatus)
      playerRef.current.off(PlayerEvent.PROGRESS_CHANGE, updateProgress)
      playerRef.current.off(PlayerEvent.SEEK, handleSeek)
    }
  }, [])
  useEffect(() => {
    if (playlists.length === 0) return
    playerRef.current.setPlaylist(playlists, 0, playerInstance.autoplay)
  }, [playlists, playerInstance.autoplay])
  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full top-0 left-0">
        <ProgressBar key="ProgressBar" percent={playerInstance.progress} onChange={changeProgress} />
      </div>
      <div className="flex space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button>
          <i className="iconfont icon-like_full text-primary text-xl" />
        </button>
        <button>
          <i className="iconfont icon-previous text-primary text-base" />
        </button>
        <button onClick={changeStatus}>
          {DynamicIcon}
        </button>
        <button>
          <i className="iconfont icon-next text-primary text-base"/>
        </button>
        <button>
          <i className="iconfont icon-share text-ct" />
        </button>
      </div>
      <div className="flex items-center space-x-6 absolute right-6 h-full">
        <PlayTypeIcon key="PlayTypeIcon" />
        <i className="iconfont icon-playlist text-ct text-base cursor-pointer" />
        <VolumeController key="VolumeController" />
      </div>
    </div>
  )
})

PlayBar.displayName = 'PlayBar'
export default PlayBar
