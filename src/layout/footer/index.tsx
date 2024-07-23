import { memo, useCallback, useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, progressAtom, songActiveIdAtom, songActiveIndexAtom } from '@/store'
import ProgressBar from './playBar/progressBar'
import PlayTypeIcon from './playBar/playTypeIcon'
import VolumeController from './playBar/volumeController'
import Thumbnail from './thumbnail'
import { PlayerEvent, playerInstance } from '@/core/player'

interface FooterProps {
  queueStatusRef: React.MutableRefObject<boolean>
  detailRef: React.MutableRefObject<boolean>
  setShowQueue: React.Dispatch<React.SetStateAction<boolean>>
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
}

const Footer = memo((props: FooterProps) => {
  const setSongActiveId = useSetAtom(songActiveIdAtom)

  const setSongActiveIndex = useSetAtom(songActiveIndexAtom)

  const [playStatus, setPlayStatus] = useAtom(playerStatusAtom)

  const [progress, setProgress] = useAtom(progressAtom)

  const dynamicIconClass = useMemo(() => {
    return playStatus === 'playing' ? 'icon-pause-circle' : 'icon-play-circle'
  }, [playStatus])

  const switchQueueStatus = useCallback(() => {
    props.queueStatusRef.current = !props.queueStatusRef.current
    props.setShowQueue(props.queueStatusRef.current)
  }, [])

  const handleProgressTo = useCallback(async (progress: number) => {
    await setProgress(progress)
    playerInstance.progressTo(progress)
  }, [])

  const switchPlayStatus = useCallback(() => {
    if (progress !== playerInstance.progress) {
      playerInstance.progressTo(progress)
    }
    playerInstance.switchPlay()
  }, [progress])

  const handleChangePrev = useCallback(async () => {
    await setProgress(0)
    playerInstance.prev()
  }, [])

  const handleChangeNext = useCallback(async () => {
    await setProgress(0)
    playerInstance.next()
  }, [])

  const handleDispatchStatus = useCallback((status: MediaSessionPlaybackState) => {
    setPlayStatus(status)
  }, [])

  const handleDispatchProgress = useCallback((progress: number) => {
    void setProgress(progress)
  }, [])

  const handleDispatchId = useCallback((id: number) => {
    void setSongActiveId(id)
  }, [])

  const handleDispatchIndex = useCallback((index: number) => {
    void setSongActiveIndex(index)
  }, [])

  useEffect(() => {
    playerInstance.on(PlayerEvent.STATUS_CHANGE, handleDispatchStatus)
    playerInstance.on(PlayerEvent.PROGRESS_CHANGE, handleDispatchProgress)
    playerInstance.on(PlayerEvent.ID_CHANGE, handleDispatchId)
    playerInstance.on(PlayerEvent.INDEX_CHANGE, handleDispatchIndex)
    return () => {
      playerInstance.off(PlayerEvent.STATUS_CHANGE, handleDispatchStatus)
      playerInstance.off(PlayerEvent.PROGRESS_CHANGE, handleDispatchProgress)
      playerInstance.off(PlayerEvent.ID_CHANGE, handleDispatchId)
      playerInstance.off(PlayerEvent.INDEX_CHANGE, handleDispatchIndex)
    }
  }, [])

  return (
    <>
      <div className="w-full h-full relative">
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <Thumbnail
            key="Thumbnail"
            progress={progress}
            detailRef={props.detailRef}
            setShowDetail={props.setShowDetail}
          />
        </div>
        <div className="absolute w-full top-0 left-0">
          <ProgressBar
            key="ProgressBar"
            percent={progress}
            onChange={handleProgressTo}
          />
        </div>
        <div className="flex space-x-6 absolute-middle-full">
          {/* <button>
            <i className="iconfont icon-like_full text-primary text-base" />
          </button> */}
          <button onClick={handleChangePrev}>
            <i className="iconfont icon-previous text-primary text-base" />
          </button>
          <button onClick={switchPlayStatus}>
            <i className={`iconfont text-5xl text-primary ${dynamicIconClass}`} />
          </button>
          <button onClick={handleChangeNext}>
            <i className="iconfont icon-next text-primary text-base"/>
          </button>
          {/* <button>
            <i className="iconfont icon-share text-ct" />
          </button> */}
        </div>
        <div className="flex items-center space-x-6 absolute right-6 h-full">
          <PlayTypeIcon key="PlayTypeIcon" />
          <i
            className="iconfont icon-playlist text-gc text-xl cursor-pointer"
            onClick={switchQueueStatus}
          />
          <VolumeController key="VolumeController" />
        </div>
      </div>
    </>
  )
})

Footer.displayName = 'Footer'
export default Footer
