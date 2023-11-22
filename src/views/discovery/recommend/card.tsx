import { memo, useCallback, type MouseEvent } from 'react'
import { playCountTrans } from '@/utils/formatter'
import PlaySpace from '@/assets/svg/play_space.svg?react'
import PlaySingle from '@/assets/svg/play_single.svg?react'

interface CardProps {
  info: PersonalLists[number]
  getPlaylists: (id: number) => void
  gotoDetail: (id: number) => void
}

// 推荐歌单小元素卡片
const Card = memo(({ info, getPlaylists, gotoDetail }: CardProps) => {
  const handleClick = useCallback((e: MouseEvent, id: number) => {
    e.stopPropagation()
    getPlaylists(id)
  }, [])

  return (
    <div className="relative box-content w-full pt-[100%] cursor-pointer group" onClick={() => { gotoDetail(info.id) }}>
      <div className="absolute w-full pt-[100%] top-0 left-0">
        <img
          className="absolute w-full h-full top-0 left-0 rounded-md"
          src={info.picUrl}
        />
        {
          info.playCount > 0
            ? (
              <div className="absolute top-1 right-2 flex items-center text-white">
                <PlaySpace className="w-4 h-4 fill-white mr-1" />
                <span className="text-xs">{playCountTrans(info.playCount)}</span>
              </div>
              )
            : null
        }
        <div
          className="absolute bottom-2.5 right-2.5 flex justify-center items-center w-9 h-9 rounded-full bg-[#eaeaea] opacity-0 group-hover:opacity-100 duration-500"
          onClick={(e: MouseEvent) => { handleClick(e, info.id) }}
        >
          <PlaySingle className="w-4 h-4" />
        </div>
      </div>
      <div className="h-[45px] py-1 text-ellipsis-l2">{info.name}</div>
    </div>
  )
})

Card.displayName = 'Card'
export default Card
