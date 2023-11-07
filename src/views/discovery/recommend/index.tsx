import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SwiperComponent from '@/components/swiper'
import { useAppSelector } from '@/hooks'
import PlaySpace from '@/assets/svg/play_space.svg?react'
import PlaySingle from '@/assets/svg/play_single.svg?react'

// 推荐歌单小元素卡片
function Card ({ info }: { info: PlayLists[number] }) {
  // 播放次数转换
  function playCountTrans (count: number): string {
    const bil = Math.pow(10, 9)
    const mil = Math.pow(10, 4)
    if (count > bil) {
      return Math.round((count / bil)) + '亿'
    } else if (count > mil) {
      return Math.round((count / mil)) + '万'
    } else return String(count)
  }
  return (
    <div className="relative box-content w-full pt-[100%] cursor-pointer group">
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
        <div className="absolute bottom-2.5 right-2.5 flex justify-center items-center w-9 h-9 rounded-full bg-[#eaeaea] opacity-0 group-hover:opacity-100 duration-500">
          <PlaySingle className="w-4 h-4" />
        </div>
      </div>
      <div className="h-[45px] py-1 text-ellipsis-l2">{info.name}</div>
    </div>
  )
}

const Recommend = memo(() => {
  const { cookie } = useAppSelector(state => state.user)
  const { banners, personalizedPlaylist, recommendList } = useAppSelector(state => state.cache)
  const CurRecommendList = useMemo(() => {
    if (cookie.length > 0) {
      return recommendList.map(item => {
        const playList: PlayLists[number] = { ...item, playCount: item.playcount }
        return (<Card key={item.id} info={playList} />)
      })
    } else {
      return personalizedPlaylist.map(item => (<Card key={item.id} info={item} />))
    }
  }, [cookie, personalizedPlaylist, recommendList])

  return (
    <div className="px-8 py-6">
      <SwiperComponent banners={banners}></SwiperComponent>
      <div className="py-3">
        <Link className="text-xl font-semibold" to="/discovery/playlist">
          推荐歌单<i className="iconfont icon-ar ml-1"></i>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-x-5 gap-y-10">
        {CurRecommendList}
      </div>
    </div>
  )
})

Recommend.displayName = 'Recommend'
export const Component = Recommend
