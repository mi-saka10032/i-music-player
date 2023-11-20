import { memo, useCallback } from 'react'
import { type SongData } from '@/core/playerType'
import Needle from '@/assets/png/playing_page_needle.png'
import ArrowDown from '@/assets/svg/arrow-down.svg?react'

interface DetailProps {
  detailRef: React.MutableRefObject<boolean>
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
  playlistId: number
  playlistName: string
  songItem: SongData | null
}

const Detail = memo((props: DetailProps) => {
  // 切换Detail显示/隐藏
  const switchDetailStatus = useCallback(() => {
    props.detailRef.current = false
    props.setShowDetail(props.detailRef.current)
  }, [])

  return (
    <div className="relative flex">
      <ArrowDown
        className="absolute left-5 top-5 w-5 h-5 cursor-pointer"
        onClick={switchDetailStatus}
      />
      <div className="relative w-1/2">
        <img src={Needle} className="absolute top-0 left-1/2 w-28 h-auto -rotate-[38deg]"/>
      </div>
      <div className="w-1/2">歌词板块</div>
    </div>
  )
})

Detail.displayName = 'Detail'
export default Detail
