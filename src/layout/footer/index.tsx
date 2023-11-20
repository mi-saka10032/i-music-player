import { memo, useCallback, useMemo, useRef } from 'react'
import { type PlayType, type SongData } from '@/core/player'
import ProgressBar from './playBar/progressBar'
import PlayTypeIcon from './playBar/playTypeIcon'
import VolumeController from './playBar/volumeController'
import PlayIcon from '@/assets/svg/play.svg?react'
import PauseIcon from '@/assets/svg/pause.svg?react'
import Thumbnail from './thumbnail'

interface FooterProps {
  queueStatusRef: React.MutableRefObject<boolean>
  detailRef: React.MutableRefObject<boolean>
  playStatus: MediaSessionPlaybackState
  type: PlayType
  mute: boolean
  volume: number
  progress: number
  thumbnailItem: SongData | null
  setShowQueue: React.Dispatch<React.SetStateAction<boolean>>
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
  onSwitchPlay: () => void
  onPrev: () => void
  onNext: () => void
  onProgressChange: (progress: number) => void
  onTypeChange: (type: PlayType) => void
  onMuteChange: (mute: boolean) => void
  onVolumeChange: (progress: number) => void
}

const Footer = memo((props: FooterProps) => {
  // 切换RightQueue显示/隐藏
  const switchQueueStatus = useCallback(() => {
    props.queueStatusRef.current = !props.queueStatusRef.current
    props.setShowQueue(props.queueStatusRef.current)
  }, [])

  // 播放/暂停图标切换
  const DynamicIcon = useMemo<JSX.Element>(() => {
    return props.playStatus === 'playing' ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />
  }, [props.playStatus])

  const curProgress = useRef(0)
  const shareProgress = useCallback((newPercent: number) => {
    curProgress.current = newPercent
  }, [])

  return (
    <>
      <div className="w-full h-full relative">
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <Thumbnail
            key="Thumbnail"
            thumbnailItem={props.thumbnailItem}
            progress={curProgress.current}
            detailRef={props.detailRef}
            setShowDetail={props.setShowDetail}
          />
        </div>
        <div className="absolute w-full top-0 left-0">
          <ProgressBar
            key="ProgressBar"
            percent={props.progress}
            onShare={shareProgress}
            onChange={props.onProgressChange}
          />
        </div>
        <div className="flex space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* <button>
            <i className="iconfont icon-like_full text-primary text-base" />
          </button> */}
          <button onClick={props.onPrev}>
            <i className="iconfont icon-previous text-primary text-base" />
          </button>
          <button onClick={props.onSwitchPlay}>
            { DynamicIcon }
          </button>
          <button onClick={props.onNext}>
            <i className="iconfont icon-next text-primary text-base"/>
          </button>
          {/* <button>
            <i className="iconfont icon-share text-ct" />
          </button> */}
        </div>
        <div className="flex items-center space-x-6 absolute right-6 h-full">
          <PlayTypeIcon
            key="PlayTypeIcon"
            type={props.type}
            onTypeChange={props.onTypeChange}
          />
          <i
            className="iconfont icon-playlist text-ct text-base cursor-pointer"
            onClick={switchQueueStatus}
          />
          <VolumeController
            key="VolumeController"
            mute={props.mute}
            volume={props.volume}
            onMuteChange={props.onMuteChange}
            onVolumeChange={props.onVolumeChange}
          />
        </div>
      </div>
    </>
  )
})

Footer.displayName = 'Footer'
export default Footer
