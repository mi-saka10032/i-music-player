import { type MouseEvent, memo, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { message } from 'antd'
import GlobalContext from './context'
import { useAppSelector, useAppDispatch, playNowById, playNowByCustom } from '@/hooks'
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
import { CUSTOM_ID } from '@/utils/constant'
import { footerHeight, siderWidth, topHeight } from './style'

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
  const getPlaylists = playNowById()
  const getJayPlaylists = playNowByCustom()

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

  // 切换显示/隐藏的class & style
  const switchDetailClass = useMemo<string>(() => {
    return showDetail ? 'top-0 opacity-1' : 'top-full opacity-0'
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

  /** 来自MusicDetail详情页的监听事件 */
  const checkPlaylistsById = useCallback(({ listId, songId }: { listId: number, songId: number }) => {
    if (listId === playlistId) {
      // 详情歌单与当前播放中歌单id相同，查找匹配歌曲ID，执行歌曲切换
      playerRef.current.setId(songId)
    } else {
      // 详情歌单与当前播放中歌单id不同，重新获取歌曲，填入歌曲索引
      if (listId === CUSTOM_ID) {
        getJayPlaylists(songId)
      } else {
        getPlaylists(listId, songId)
      }
    }
  }, [playlistId])
  /** 来自MusicDetail详情页的监听事件 */

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

  useEffect(() => {
    playerRef.current.on(PlayerEvent.CHECK_BY_ID, checkPlaylistsById)
    return () => {
      playerRef.current.off(PlayerEvent.CHECK_BY_ID, checkPlaylistsById)
    }
  }, [playlistId])
  /** 挂载时触发 */

  return (
    <GlobalContext.Provider value={{ player: playerRef.current }}>
      <div
        className='relative grid w-full h-full m-0 p-0 overflow-hidden'
        style={{
          gridTemplateRows: `${topHeight} 1fr ${footerHeight}`,
          gridTemplateColumns: `${siderWidth} 1fr`
        }}
        onClick={handleContainerClick}
      >
        {/* Header 占据网格第1行，第1-3列网格线 */}
        <div
          className="flex relative z-40 col-start-1 col-end-3"
          style={{ height: topHeight }}
        >
          <Header
            detailRef={detailRef}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
          />
        </div>
        {/* LeftSider 占据网格第2行，默认第1-2列网格线 */}
        <div className="bg-[#ededed] overflow-hidden" >
          <LeftSider />
        </div>
        {/* Content 占据网格第2行，默认第2-3列网格线 */}
        <div className="flex overflow-hidden">
          <Content />
        </div>
        {/* Footer 占据网格第3行，默认第1-3列网格线 */}
        <div
          ref={footerRef}
          className="relative z-40 w-full col-start-1 col-end-3 bg-white rounded-b-2xl"
        >
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
        {/* RightQueue fixed */}
        <div
          ref={queueRef}
          className={`fixed top-0 right-0 z-30 flex flex-col w-[30rem] h-full transition-all duration-500 ${switchQueueStatus}`}
          style={{ paddingTop: topHeight, paddingBottom: footerHeight }}
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
        {/* Detail fixed */}
        <div
          className={`fixed z-20 left-0 w-full h-full transition-opacity duration-500 bg-[#f8f8f8] ${switchDetailClass}`}
          style={{ paddingTop: topHeight, paddingBottom: footerHeight }}
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
