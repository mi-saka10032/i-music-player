import { memo } from 'react'
import { type SongData } from '@/core/playerType'
import Needle from '@/assets/png/playing_page_needle.png'

interface DetailProps {
  playlistId: number
  playlistName: string
  songItem: SongData | null
}

const Detail = memo((props: DetailProps) => {
  return (
    <div className="flex">
      <div className="relative w-1/2">
        <img src={Needle} className="absolute top-0 left-1/2 w-28 h-auto -rotate-[38deg]"/>
      </div>
      <div className="w-1/2">歌词板块</div>
    </div>
  )
})

Detail.displayName = 'Detail'
export default Detail
