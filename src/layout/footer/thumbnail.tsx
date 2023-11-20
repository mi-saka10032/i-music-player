import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Arrow from '@/assets/svg/arrow.svg?react'
import { type SongData } from '@/core/playerType'
import { durationTrans } from '@/utils/formatter'

interface ThumbnailProps {
  thumbnailItem: SongData | null
  progress: number
  detailRef: React.MutableRefObject<boolean>
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
}

const Thumbnail = memo((props: ThumbnailProps) => {
  // 切换Detail显示/隐藏
  const switchDetailStatus = useCallback(() => {
    props.detailRef.current = !props.detailRef.current
    props.setShowDetail(props.detailRef.current)
  }, [])

  const [isShow, setShow] = useState(false)

  const picUrl = useMemo<string>(() => {
    return props.thumbnailItem != null ? props.thumbnailItem.album?.picUrl : ''
  }, [props.thumbnailItem])

  const songName = useMemo<string>(() => {
    return props.thumbnailItem != null ? props.thumbnailItem.name : ''
  }, [props.thumbnailItem])

  const artistsName = useMemo<string>(() => {
    const artists = props.thumbnailItem != null && Array.isArray(props.thumbnailItem.artists) ? props.thumbnailItem.artists : []
    return artists.map(item => item.name).join(' / ')
  }, [props.thumbnailItem])

  const duration = useMemo<string>(() => {
    const time = props.thumbnailItem?.time ?? 0
    return durationTrans(time)
  }, [props.thumbnailItem])

  const currentTime = useMemo<string>(() => {
    const time = props.thumbnailItem?.time ?? 0
    return durationTrans(time * props.progress / 100)
  }, [props.thumbnailItem, props.progress])

  useEffect(() => {
    setShow(props.thumbnailItem != null)
  }, [props.thumbnailItem])

  return (
    isShow
      ? (
        <div className="flex items-center">
          <div
            className="relative group cursor-pointer"
            title="展开音乐详情页"
            onClick={switchDetailStatus}
          >
            <img src={picUrl} className="w-12 h-12 rounded-lg group-hover:blur-[2px]"/>
            <Arrow className="absolute hidden left-0 top-0 w-full h-1/2 fill-white group-hover:block" />
            <Arrow className="absolute hidden left-0 bottom-0 w-full h-1/2 fill-white group-hover:block rotate-180" />
          </div>
          <div className="ml-3">
            <div className="flex items-center text-base">
              <span className="max-w-[10rem] text-ellipsis text-[#333]" title={songName}>{songName}</span>
              <span className="max-w-[8rem] text-ellipsis text-sm ml-2 text-neutral-500" title={artistsName}>{artistsName}</span>
            </div>
            {
              Number(props.thumbnailItem?.time) > 0
                ? (
                  <div className="flex items-center text-base text-[#cecece]">
                    <span>{currentTime}</span>
                    <span className="mx-1">/</span>
                    <span>{duration}</span>
                  </div>
                  )
                : null
            }
          </div>
        </div>
        )
      : null
  )
})

Thumbnail.displayName = 'Thumbnail'
export default Thumbnail
