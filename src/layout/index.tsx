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
import player, { PlayType, PlayerEvent } from '@/core/player'
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
  // 播放类型数组
  const playTypeRef = useRef<PlayType[]>([
    PlayType.loop,
    PlayType.single,
    PlayType.random,
    PlayType.sequential
  ])

  /** 当鼠标点击在非列表栏或底栏触发时，强制隐藏列表栏 */
  const footerRef = useRef<HTMLDivElement>(null)
  const queueRef = useRef<HTMLDivElement>(null)
  // 列表栏的显示隐藏状态ref，传递给footer做修改，以避免footer不必要的更新
  const queueStatusRef = useRef(false)
  // 列表栏的显示隐藏状态state，传递给queue控制queue的显示/隐藏
  const [showQueue, setShowQueue] = useState(queueStatusRef.current)

  const handleContainerClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const footer = footerRef.current as HTMLElement
    const queue = queueRef.current as HTMLElement
    if (!(footer.contains(target) || queue.contains(target)) && showQueue) {
      queueStatusRef.current = false
      setShowQueue(queueStatusRef.current)
    }
  }, [showQueue])
  /** 当鼠标点击在非列表栏或底栏触发时，强制隐藏列表栏 */

  /** RightQueue Loading */
  const handleSwitchLoading = useCallback((isLoading: boolean) => {
    dispatch(setLoading(isLoading))
  }, [])
  /** RightQueue Loading */

  /** HowlPlayer实例监听回调 */
  const handleDispatchStatus = useCallback((status: MediaSessionPlaybackState) => {
    dispatch(setPlayStatus(status))
  }, [])

  const handleDispatchProgress = useCallback((progress: number) => {
    dispatch(setProgress(progress))
  }, [])

  const handleDispatchId = useCallback((id: number) => {
    dispatch(setPlayId(id))
  }, [])

  const handleDispatchIndex = useCallback((index: number) => {
    dispatch(setPlayIndex(index))
  }, [])

  const handleDispatchType = useCallback((type: PlayType) => {
    const index = playTypeRef.current.findIndex((item) => item === type)
    const newType = playTypeRef.current[index + 1] ?? playTypeRef.current[0]
    dispatch(setPlayType(newType))
  }, [])

  const handleDispatchMute = useCallback((mute: boolean) => {
    dispatch(setMute(mute))
  }, [])

  const handleDispatchVolume = useCallback((volume: number) => {
    dispatch(setVolume(volume))
  }, [])
  /** HowlPlayer实例监听回调 */

  /** HowlPlayer实例手动执行函数 */
  const handleSwitchPlay = useCallback(() => {
    playerRef.current.switchPlay()
  }, [])

  const handleChangePrev = useCallback(() => {
    playerRef.current.back()
  }, [])

  const handleChangeNext = useCallback(() => {
    playerRef.current.next()
  }, [])

  const handleChangeIndex = useCallback((index: number) => {
    void playerRef.current.setIndex(index)
  }, [])

  const handleProgressTo = useCallback((progress: number) => {
    handleDispatchProgress(progress)
    playerRef.current.progressTo(progress)
  }, [])
  /** HowlPlayer实例手动执行函数 */

  useEffect(() => {
    playerRef.current.setRepeatMode(playerType.type)
  }, [playerType.type])

  useEffect(() => {
    playerRef.current.setMute(playerType.mute)
  }, [playerType.mute])

  useEffect(() => {
    playerRef.current.setVolume(playerType.volume)
  }, [playerType.volume])

  useEffect(() => {
    if (playlists.length > 0 && playerInstance.autoplay) {
      playerRef.current.setPlaylist(playlists, 0, playerInstance.autoplay)
    }
  }, [playlists, playerInstance.autoplay])

  /** 挂载时触发 */
  useEffect(() => {
    // 获取轮播列表和每日推荐
    void dispatch(fetchRecommendData())
    playerRef.current.on(PlayerEvent.STATUS_CHANGE, handleDispatchStatus)
    playerRef.current.on(PlayerEvent.PROGRESS_CHANGE, handleDispatchProgress)
    playerRef.current.on(PlayerEvent.ID_CHANGE, handleDispatchId)
    playerRef.current.on(PlayerEvent.INDEX_CHANGE, handleDispatchIndex)
    return () => {
      playerRef.current.off(PlayerEvent.STATUS_CHANGE, handleDispatchStatus)
      playerRef.current.off(PlayerEvent.PROGRESS_CHANGE, handleDispatchProgress)
      playerRef.current.off(PlayerEvent.ID_CHANGE, handleDispatchId)
      playerRef.current.off(PlayerEvent.INDEX_CHANGE, handleDispatchIndex)
    }
  }, [])
  /** 挂载时触发 */

  return (
    <GlobalContext.Provider value={{ player: playerRef.current }}>
      <div
        className='relative grid grid-cols-[200px_1fr] grid-rows-[1fr_60px] w-full h-full m-0 p-0 overflow-hidden'
        onClick={handleContainerClick}
      >
        <Header />
        <LeftSider />
        <Content />
        <Footer
          ref={footerRef}
          queueStatusRef={queueStatusRef}
          playStatus={playerInstance.status}
          type={playerType.type}
          mute={playerType.mute}
          volume={playerType.volume}
          progress={playerInstance.progress}
          playlists={playlists}
          setShowQueue={setShowQueue}
          onSwitchPlay={handleSwitchPlay}
          onPrev={handleChangePrev}
          onNext={handleChangeNext}
          onProgressChange={handleProgressTo}
          onTypeChange={handleDispatchType}
          onMuteChange={handleDispatchMute}
          onVolumeChange={handleDispatchVolume}
        />
        <RightQueue
          ref={queueRef}
          showQueue={showQueue}
          activeId={playId}
          activeIndex={playIndex}
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
