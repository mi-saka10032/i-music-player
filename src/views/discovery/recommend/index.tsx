import { memo } from 'react'
import { Link } from 'react-router-dom'
import SwiperComponent from '@/components/swiper'
import { useAppSelector } from '@/hooks'

function Card ({ info }: { info: PlayLists[number] }) {
  return (
    <div className="relative box-content w-full pt-[100%]">
      <div className="absolute w-full pt-[100%] top-0 left-0">
        <img
          className="absolute w-full h-full top-0 left-0 rounded-md"
          src={info.picUrl}
        />
      </div>
      <div className="h-[45px] py-1 text-ellipsis-l2">{info.name}</div>
    </div>
  )
}

const Recommend = memo(() => {
  const { banners, personalizedPlaylist } = useAppSelector((state) => state.cache)

  return (
    <div className="px-8 py-6">
      <SwiperComponent banners={banners}></SwiperComponent>
      <div className="py-3">
        <Link className="text-lg font-bold" to="/discovery/playlist">
          推荐歌单
          <i className="iconfont icon-ar ml-1"></i>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-x-5 gap-y-10">
        {personalizedPlaylist.map((item) => (
          <Card key={item.id} info={item} />
        ))}
      </div>
    </div>
  )
})

Recommend.displayName = 'Recommend'
export const Component = Recommend
