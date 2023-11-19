import { memo, useEffect, useMemo, useState } from 'react'
import { type SongData } from '@/core/playerType'
interface ThumbnailProps {
  thumbnailItem: SongData | null
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

  useEffect(() => {
    setShow(props.thumbnailItem != null)
  }, [props.thumbnailItem])

  return (
    isShow
      ? (
        <div className="flex items-center">
          <img src={picUrl} className="w-12 h-12 rounded-lg" />
          <div className="ml-3 text-[#333]">
            <p className="w-40 text-ellipsis text-base" title={songName}>{songName}</p>
            <p className="text-sm" title={artistsName}>{artistsName}</p>
          </div>
        </div>
        )
      : null
  )
})

Thumbnail.displayName = 'Thumbnail'
export default Thumbnail
