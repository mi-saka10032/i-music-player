import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import QueueContext from '@/layout/context'
import { type Handler } from 'mitt'
import player, { PlayerEvent, type PlayerState } from '@/core/player'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { setPlayStatus, setProgress, setPlayIndex } from '@/store/playlist'
import ProgressBar from '@/layout/footer/playBar/progressBar'
import PlayTypeIcon from '@/layout/footer/playBar/playTypeIcon'
import VolumeController from '@/layout/footer/playBar/volumeController'
import PlayIcon from '@/assets/svg/play.svg?react'
import PauseIcon from '@/assets/svg/pause.svg?react'

// 总播放栏组件
const PlayBar = memo(() => {
  const { showQueue, setShowQueue } = useContext(QueueContext)
  const switchQueueStatus = useCallback(() => {
    setShowQueue(!showQueue)
  }, [showQueue])

  const { playlists, playerInstance } = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()

  // 生命周期内仅维持一份player实例
  const playerRef = useRef(player)

  // 播放/暂停图标切换
  const DynamicIcon = useMemo<JSX.Element>(() => {
    return playerInstance.status === 'playing' ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />
  }, [playerInstance.status])

  // 真正的切换播放/暂停监听回调
  const switchStatus: Handler<PlayerState> = useCallback((state) => {
    dispatch(setPlayStatus(state.status))
  }, [])

  // 手动地调用实例播放/暂停
  const changeStatus = useCallback(() => {
    if (playerInstance.status === 'playing') {
      playerRef.current.pause()
    } else {
      playerRef.current.play()
    }
  }, [playerInstance.status])

  // 真正的自动更新进度
  const updateProgress: Handler<number> = useCallback((progress) => {
    dispatch(setProgress(progress))
  }, [])

  // 手动地调用实例跳进度
  const changeProgress = useCallback((progress: number) => {
    updateProgress(progress)
    playerRef.current.progressTo(progress)
  }, [])

  // 自动更新索引
  const updateIndex: Handler<number> = useCallback((index) => {
    dispatch(setPlayIndex(index))
  }, [])

  // 下一首
  const switchNext = useCallback(() => {
    playerRef.current.next()
  }, [])

  // 上一首
  const switchBack = useCallback(() => {
    playerRef.current.back()
  }, [])

  // 全局Player事件监听
  useEffect(() => {
    playerRef.current.on(PlayerEvent.PLAY, switchStatus)
    playerRef.current.on(PlayerEvent.PAUSE, switchStatus)
    playerRef.current.on(PlayerEvent.STOP, switchStatus)
    playerRef.current.on(PlayerEvent.PROGRESS_CHANGE, updateProgress)
    playerRef.current.on(PlayerEvent.INDEX_CHANGE, updateIndex)
    return () => {
      playerRef.current.off(PlayerEvent.PLAY, switchStatus)
      playerRef.current.off(PlayerEvent.PAUSE, switchStatus)
      playerRef.current.off(PlayerEvent.STOP, switchStatus)
      playerRef.current.off(PlayerEvent.PROGRESS_CHANGE, updateProgress)
      playerRef.current.off(PlayerEvent.INDEX_CHANGE, updateIndex)
    }
  }, [])

  // 自动播放判断
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
        {/* <button>
          <i className="iconfont icon-like_full text-primary text-base" />
        </button> */}
        <button onClick={switchBack}>
          <i className="iconfont icon-previous text-primary text-base" />
        </button>
        <button onClick={changeStatus}>
          { DynamicIcon }
        </button>
        <button onClick={switchNext}>
          <i className="iconfont icon-next text-primary text-base"/>
        </button>
        {/* <button>
          <i className="iconfont icon-share text-ct" />
        </button> */}
      </div>
      <div className="flex items-center space-x-6 absolute right-6 h-full">
        <PlayTypeIcon key="PlayTypeIcon" />
        <i
          className="iconfont icon-playlist text-ct text-base cursor-pointer"
          onClick={switchQueueStatus}
        />
        <VolumeController key="VolumeController" />
      </div>
    </div>
  )
})

PlayBar.displayName = 'PlayBar'
export default PlayBar