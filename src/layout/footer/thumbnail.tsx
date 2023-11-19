import { memo, useEffect, useMemo, useState } from 'react'
import { type SongData } from '@/core/playerType'
import { durationTrans } from '@/utils/formatter'

interface ThumbnailProps {
  thumbnailItem: SongData | null
  progress: number
}

const Thumbnail = memo((props: ThumbnailProps) => {
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
          <img src={picUrl} className="w-12 h-12 rounded-lg" />
          <div className="ml-3 text-[#333]">
            <div className="flex items-center text-base">
              <span className="max-w-36 text-ellipsis" title={songName}>{songName}</span>
              <span className="max-w-36 text-ellipsis text-sm ml-2" title={artistsName}>{artistsName}</span>
            </div>
            {
              Number(props.thumbnailItem?.time) > 0
                ? (
                  <div className="text-base text-[#cecece]">
                    <span>{currentTime}</span>
                    <span> / </span>
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
