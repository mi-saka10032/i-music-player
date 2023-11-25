import { type MouseEvent, memo, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { message } from 'antd'
import GlobalContext from './context'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { fetchRecommendData } from '@/store/cache'
import { clearPlaylists, setActiveId, setActiveIndex } from '@/store/playlist'
import { clearPlayerStatus, setPlayStatus } from '@/store/playerStatus'
import { clearPlayerProgress, setProgress } from '@/store/playerProgress'
import { setMute, setPlayType, setVolume } from '@/store/playerInstance'
import player, { PlayType, PlayerEvent, type SongData } from '@/core/player'
import Header from './header'
import Content from './content'
import Footer from './footer'
import LeftSider from './leftSider'
import RightQueue from './rightQueue'
import Detail from './detail'

const Layout = memo(() => {
  const {
    activeId,
    activeIndex,
    playlists,
    playlistLoading,
    playlistId,
    playlistName,
    autoplay
  } = useAppSelector(state => state.playlist)
  const { status } = useAppSelector(state => state.playerStatus)
  const { progress } = useAppSelector(state => state.playerProgress)
  const {
    playType,
    mute,
    volume
  } = useAppSelector(state => state.playerInstance)
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
  // 无效音频的提示信息API
  const [messageApi, contextHolder] = message.useMessage()

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

  // 切换显示/隐藏的class类名
  const switchQueueStatus = useMemo<string>(() => {
    return showQueue ? 'opacity-1' : 'translate-x-[30rem] opacity-0'
  }, [showQueue])
  /** 当鼠标点击在非列表栏或底栏触发时，强制隐藏列表栏 */

  /** 音乐详情页的显示/隐藏 */
  // 列表栏的显示隐藏状态ref，传递给footer做修改，以避免footer不必要的更新
  const detailRef = useRef(false)
  // 详情页的显示隐藏状态state，传递给detail控制detail的显示/隐藏以及header的隐藏/显示
  const [showDetail, setShowDetail] = useState(detailRef.current)

  // 切换显示/隐藏的class类名
  const switchDetailClass = useMemo<string>(() => {
    return showDetail ? 'opacity-1' : 'translate-y-full opacity-0'
  }, [showDetail])
  /** 音乐详情页的显示/隐藏 */

  /** HowlPlayer实例监听回调 */
  const handleDispatchStatus = useCallback((status: MediaSessionPlaybackState) => {
    dispatch(setPlayStatus(status))
  }, [])

  const handleDispatchProgress = useCallback((progress: number) => {
    dispatch(setProgress(progress))
  }, [])

  const handleDispatchId = useCallback((id: number) => {
    dispatch(setActiveId(id))
  }, [])

  const handleDispatchIndex = useCallback((index: number) => {
    dispatch(setActiveIndex(index))
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

  const showInvalidTips = useCallback(() => {
    dispatch(setPlayStatus('none'))
    void messageApi.open({
      type: 'error',
      content: '音乐已失效或没有版权'
    })
  }, [])
  /** HowlPlayer实例监听回调 */

  /** HowlPlayer实例手动执行函数 */
  const handleSwitchPlay = useCallback(() => {
    if (progress !== playerRef.current.progress) {
      playerRef.current.progressTo(progress)
    }
    playerRef.current.switchPlay()
  }, [progress])

  const handleChangePrev = useCallback(() => {
    dispatch(setProgress(0))
    playerRef.current.prev()
  }, [])

  const handleChangeNext = useCallback(() => {
    dispatch(setProgress(0))
    playerRef.current.next()
  }, [])

  const handleChangeIndex = useCallback((index: number) => {
    dispatch(setProgress(0))
    void playerRef.current.setIndex(index)
  }, [])

  const handleProgressTo = useCallback((progress: number) => {
    handleDispatchProgress(progress)
    playerRef.current.progressTo(progress)
  }, [])

  const handleClearPlaylist = useCallback(() => {
    playerRef.current.reset()
    dispatch(clearPlaylists())
    dispatch(clearPlayerStatus())
    dispatch(clearPlayerProgress())
  }, [])
  /** HowlPlayer实例手动执行函数 */

  // 音乐详情数据
  const songDetail = useMemo<SongData | null>(() => {
    return playlists[activeIndex] ?? null
  }, [playlists, activeIndex])

  /** store数据变化的系列副作用 */
  useEffect(() => {
    playerRef.current.setRepeatMode(playType)
  }, [playType])

  useEffect(() => {
    playerRef.current.setMute(mute)
  }, [mute])

  useEffect(() => {
    playerRef.current.setVolume(volume)
  }, [volume])

  const lastPlaylists = useRef<SongData[]>([])
  useEffect(() => {
    if (playlists.length > 0 && playlists !== lastPlaylists.current) {
      lastPlaylists.current = playlists
      playerRef.current.setPlaylist(playlists, activeIndex, autoplay)
    }
  }, [playlists, activeIndex, autoplay])
  /** store数据变化的系列副作用 */

  /** 挂载时触发 */
  useEffect(() => {
    // 获取轮播列表和每日推荐
    void dispatch(fetchRecommendData())
    playerRef.current.on(PlayerEvent.STATUS_CHANGE, handleDispatchStatus)
    playerRef.current.on(PlayerEvent.PROGRESS_CHANGE, handleDispatchProgress)
    playerRef.current.on(PlayerEvent.ID_CHANGE, handleDispatchId)
    playerRef.current.on(PlayerEvent.INDEX_CHANGE, handleDispatchIndex)
    playerRef.current.on(PlayerEvent.INVALID, showInvalidTips)
    return () => {
      playerRef.current.off(PlayerEvent.STATUS_CHANGE, handleDispatchStatus)
      playerRef.current.off(PlayerEvent.PROGRESS_CHANGE, handleDispatchProgress)
      playerRef.current.off(PlayerEvent.ID_CHANGE, handleDispatchId)
      playerRef.current.off(PlayerEvent.INDEX_CHANGE, handleDispatchIndex)
      playerRef.current.off(PlayerEvent.INVALID, showInvalidTips)
    }
  }, [])
  /** 挂载时触发 */

  return (
    <GlobalContext.Provider value={{ player: playerRef.current }}>
      <div
        className='relative grid grid-cols-[200px_1fr] grid-rows-[1fr_60px] w-full h-full m-0 p-0 overflow-hidden'
        onClick={handleContainerClick}
      >
        <div className="flex absolute z-40 top-[0] left-[0] w-full h-[50px] ">
          <Header
            detailRef={detailRef}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
          />
        </div>
        <div className="pt-[50px] bg-[#ededed] overflow-auto">
          <LeftSider />
        </div>
        <div className="flex w-full h-full overflow-hidden">
          <Content />
        </div>
        <div ref={footerRef} className="relative z-40 w-full h-full col-start-1 col-end-3 bg-white">
          <Footer
            queueStatusRef={queueStatusRef}
            detailRef={detailRef}
            playStatus={status}
            type={playType}
            mute={mute}
            volume={volume}
            progress={progress}
            thumbnailItem={songDetail}
            setShowQueue={setShowQueue}
            setShowDetail={setShowDetail}
            onSwitchPlay={handleSwitchPlay}
            onPrev={handleChangePrev}
            onNext={handleChangeNext}
            onProgressChange={handleProgressTo}
            onTypeChange={handleDispatchType}
            onMuteChange={handleDispatchMute}
            onVolumeChange={handleDispatchVolume}
        />
        </div>
        <div
          ref={queueRef}
          className={`fixed top-0 right-0 z-30 flex flex-col w-[30rem] h-full transition-all duration-500 ${switchQueueStatus}`}
        >
          <RightQueue
            showQueue={showQueue}
            activeId={activeId}
            activeIndex={activeIndex}
            playlists={playlists}
            playStatus={status}
            loading={playlistLoading}
            onIndexChange={handleChangeIndex}
            clearPlaylist={handleClearPlaylist}
          />
        </div>
        <div
          className={`fixed z-20 flex flex-col w-full left-0 top-[50px] transition-all duration-500 bg-[#f8f8f8] ${switchDetailClass}`}
          style={{ height: 'calc(100vh - 50px)' }}
        >
          <Detail
            detailRef={detailRef}
            setShowDetail={setShowDetail}
            playlistId={playlistId}
            playlistName={playlistName}
            songItem={songDetail}
            playStatus={status}
            progress={progress}
          />
        </div>
        {contextHolder}
      </div>
    </GlobalContext.Provider>
  )
})

Layout.displayName = 'Layout'
export default Layout
