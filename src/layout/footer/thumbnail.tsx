import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { songActiveIndexAtom, songListsAtom } from '@/store'
import { durationTrans } from '@/utils'

interface ThumbnailProps {
  progress: number
  detailRef: React.MutableRefObject<boolean>
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
}

const Thumbnail = memo((props: ThumbnailProps) => {
  const songLists = useAtomValue(songListsAtom)

  const songActiveIndex = useAtomValue(songActiveIndexAtom)

  const thumbnailItem = useMemo<SongData | null>(() => {
    return songLists[songActiveIndex] ?? null
  }, [songLists, songActiveIndex])

  // 切换Detail显示/隐藏
  const switchDetailStatus = useCallback(() => {
    props.detailRef.current = !props.detailRef.current
    props.setShowDetail(props.detailRef.current)
  }, [])

  const [isShow, setShow] = useState(false)

  const picUrl = useMemo<string>(() => {
    return thumbnailItem != null ? thumbnailItem.album?.picUrl : ''
  }, [thumbnailItem])

  const songName = useMemo<string>(() => {
    return thumbnailItem != null ? thumbnailItem.name : ''
  }, [thumbnailItem])

  const artistsName = useMemo<string>(() => {
    const artists = thumbnailItem != null && Array.isArray(thumbnailItem.artists) ? thumbnailItem.artists : []
    return artists.map(item => item.name).join(' / ')
  }, [thumbnailItem])

  const duration = useMemo<string>(() => {
    const time = thumbnailItem?.time ?? 0
    return durationTrans(time)
  }, [thumbnailItem])

  const currentTime = useMemo<string>(() => {
    const time = thumbnailItem?.time ?? 0
    return durationTrans(time * props.progress / 100)
  }, [thumbnailItem, props.progress])

  useEffect(() => {
    setShow(thumbnailItem != null)
  }, [thumbnailItem])

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
            <div className="font-bold text-white text-center hidden group-hover:block">
              <i className="iconfont icon-arrow-bottom absolute left-0 top-0 w-full h-1/2 rotate-180" />
              <i className="iconfont icon-arrow-bottom absolute left-0 bottom-0 w-full h-1/2" />
            </div>
          </div>
          <div className="ml-3">
            <div className="flex items-center text-base">
              <span className="max-w-[10rem] text-ellipsis text-[#333]" title={songName}>{songName}</span>
              <span className="max-w-[8rem] text-ellipsis text-sm ml-2 text-neutral-500" title={artistsName}>{artistsName}</span>
            </div>
            {
              Number(thumbnailItem?.time) > 0
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
