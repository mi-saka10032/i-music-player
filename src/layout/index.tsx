import { type MouseEvent, memo, useEffect, useState, useRef, useCallback } from 'react'
import GlobalContext from './context'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { fetchRecommendData } from '@/store/cache'
import {
  setPlayId,
  setLoading,
  setPlayStatus,
  setPlayIndex,
  setProgress,
  setPlayType,
  setMute,
  setVolume
} from '@/store/playlist'
import player, { type PlayType, PlayerEvent, type PlayerState } from '@/core/player'
import Header from './header'
import Content from './content'
import Footer from './footer'
import LeftSider from './leftSider'
import RightQueue from './rightQueue'

const Layout = memo(() => {
  const {
    playId,
    playIndex,
    playlists,
    playerType,
    playerInstance,
    playlistLoading
  } = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()

  // 生命周期内仅维持一份player实例
  const playerRef = useRef(player)

  /** 当鼠标点击在非列表栏或底栏触发时，强制隐藏列表栏 */
  const initialQueueStatus = useRef(false)
  const [showQueue, setShowQueue] = useState(initialQueueStatus.current)
  const footerRef = useRef<HTMLDivElement>(null)
  const queueRef = useRef<HTMLDivElement>(null)

  const handleContainerClick = useCallback((e: MouseEvent) => {
    if (footerRef.current == null || queueRef.current == null) {
      return
    }
    const target = e.target as HTMLElement
    if (!(footerRef.current?.contains(target) || queueRef.current?.contains(target))) {
      if (showQueue) {
        setShowQueue(() => false)
      }
    }
  }, [showQueue])
  /** 当鼠标点击在非列表栏或底栏触发时，强制隐藏列表栏 */

  /** RightQueue Loading */
  const handleSwitchLoading = useCallback((isLoading: boolean) => {
    dispatch(setLoading(isLoading))
  }, [])
  /** RightQueue Loading */

  /** HowlPlayer实例监听回调 */
  const handleChangeStatus = useCallback((state: PlayerState) => {
    dispatch(setPlayId(state.id))
    dispatch(setPlayStatus(state.status))
  }, [])

  const handleChangeProgress = useCallback((progress: number) => {
    dispatch(setProgress(progress))
  }, [])

  const handleChangeIndex = useCallback((index: number) => {
    dispatch(setPlayIndex(index))
  }, [])
  /** HowlPlayer实例监听回调 */

  /** HowlPlayer实例手动执行函数 */
  const handlePlay = useCallback(() => {
    playerRef.current.play()
  }, [])

  const handlePause = useCallback(() => {
    playerRef.current.pause()
  }, [])

  const handleChangePrev = useCallback(() => {
    playerRef.current.back()
  }, [])

  const handleChangeNext = useCallback(() => {
    playerRef.current.next()
  }, [])

  const handleProgressTo = useCallback((progress: number) => {
    handleChangeProgress(progress)
    playerRef.current.progressTo(progress)
  }, [])

  const handleChangePlayType = useCallback((type: PlayType) => {
    dispatch(setPlayType(type))
    playerRef.current.setRepeatMode(type)
  }, [])

  const handleChangeMute = useCallback((mute: boolean) => {
    dispatch(setMute(mute))
    playerRef.current.setMute(mute)
  }, [])

  const handleChangeVolume = useCallback((volume: number) => {
    dispatch(setVolume(volume))
    playerRef.current.setVolume(volume)
  }, [])
  /** HowlPlayer实例手动执行函数 */

  // 仅当playIndex真正变化时才调用，否则对相同index点击会重新加载player
  useEffect(() => {
    console.log(playIndex)
    void playerRef.current.setIndex(playIndex)
  }, [playIndex])

  useEffect(() => {
    if (playlists.length > 0 && playerInstance.autoplay) {
      playerRef.current.setPlaylist(playlists, 0, playerInstance.autoplay)
    }
  }, [playlists, playerInstance.autoplay])

  /** 挂载时触发 */
  useEffect(() => {
    // 获取轮播列表和每日推荐
    void dispatch(fetchRecommendData())
    playerRef.current.on(PlayerEvent.PLAY, handleChangeStatus)
    playerRef.current.on(PlayerEvent.PAUSE, handleChangeStatus)
    playerRef.current.on(PlayerEvent.STOP, handleChangeStatus)
    playerRef.current.on(PlayerEvent.PROGRESS_CHANGE, handleChangeProgress)
    return () => {
      playerRef.current.off(PlayerEvent.PLAY, handleChangeStatus)
      playerRef.current.off(PlayerEvent.PAUSE, handleChangeStatus)
      playerRef.current.off(PlayerEvent.STOP, handleChangeStatus)
      playerRef.current.off(PlayerEvent.PROGRESS_CHANGE, handleChangeProgress)
    }
  }, [])
  /** 挂载时触发 */

  return (
    <GlobalContext.Provider
      value={{
        showQueue,
        setShowQueue,
        player: playerRef.current
      }}
    >
      <div
        className='relative grid grid-cols-[200px_1fr] grid-rows-[1fr_60px] w-full h-full m-0 p-0 overflow-hidden'
        onClick={handleContainerClick}
      >
        <Header />
        <LeftSider />
        <Content />
        <Footer
          ref={footerRef}
          initialQueue={initialQueueStatus.current}
          playStatus={playerInstance.status}
          type={playerType.type}
          mute={playerType.mute}
          volume={playerType.volume}
          progress={playerInstance.progress}
          playlists={playlists}
          setShowQueue={setShowQueue}
          onPlay={handlePlay}
          onPause={handlePause}
          onPrev={handleChangePrev}
          onNext={handleChangeNext}
          onProgressChange={handleProgressTo}
          onTypeChange={handleChangePlayType}
          onMuteChange={handleChangeMute}
          onVolumeChange={handleChangeVolume}
        />
        <RightQueue
          ref={queueRef}
          className={ showQueue ? '-translate-x-[30rem] opacity-100' : 'opacity-0' }
          activeId={playId}
          playlists={playlists}
          playStatus={playerInstance.status}
          loading={playlistLoading}
          onLoaded={handleSwitchLoading}
          onIndexChange={handleChangeIndex}
        />
      </div>
    </GlobalContext.Provider>
  )
})

Layout.displayName = 'Layout'
export default Layout
