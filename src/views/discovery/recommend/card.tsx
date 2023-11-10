import { memo, useCallback, type MouseEvent } from 'react'
import PlaySpace from '@/assets/svg/play_space.svg?react'
import PlaySingle from '@/assets/svg/play_single.svg?react'

interface CardProps {
  info: PersonalLists[number]
  getPlaylists: (id: number, autoplay: boolean) => void
}

// 推荐歌单小元素卡片
const Card = memo(({ info, getPlaylists }: CardProps) => {
  // 播放次数转换
  const playCountTrans = useCallback((count: number): string => {
    const bil = Math.pow(10, 9)
    const mil = Math.pow(10, 4)
    if (count > bil) {
      return Math.round((count / bil)) + '亿'
    } else if (count > mil) {
      return Math.round((count / mil)) + '万'
    } else return String(count)
  }, [])
  const handleClick = useCallback((e: MouseEvent, id: number, autoplay: boolean) => {
    e.stopPropagation()
    getPlaylists(id, autoplay)
  }, [])
  return (
    <div className="relative box-content w-full pt-[100%] cursor-pointer group" onClick={(e: MouseEvent) => { handleClick(e, info.id, false) }}>
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
          onClick={(e: MouseEvent) => { handleClick(e, info.id, true) }}
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
