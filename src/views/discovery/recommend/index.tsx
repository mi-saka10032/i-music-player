import { memo, useCallback, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, playNowById, playNowByCustom } from '@/hooks'
import Card from './card'
import SwiperComponent from '@/components/swiper'

const Recommend = memo(() => {
  const navigate = useNavigate()

  const { cookie } = useAppSelector(state => state.user)
  const { banners, personalizedPlaylist, recommendList } = useAppSelector(state => state.cache)

  const getPlaylists = playNowById()
  const getJayPlaylists = playNowByCustom()

  const gotoDetail = useCallback((id: number) => {
    navigate(`/musicDetail/${id}`)
  }, [])

  // 个人音乐后台提供歌曲
  const customCard = useRef<PersonalLists[number]>({
    id: 0,
    name: 'Jay Zhou',
    picUrl: 'http://p2.music.126.net/Esjm32Q05PQoX8pF008u7w==/109951165793871057.jpg',
    playCount: 0
  })

  const CurRecommendList = useMemo(() => {
    if (cookie.length > 0) {
      return recommendList.map(item => {
        const playList: PersonalLists[number] = { ...item, playCount: item.playcount }
        return (
          <Card
            key={item.id}
            info={playList}
            getPlaylists={getPlaylists}
            gotoDetail={gotoDetail}
           />
        )
      })
    } else {
      return personalizedPlaylist.map(item => (
        <Card
          key={item.id}
          info={item}
          getPlaylists={getPlaylists}
          gotoDetail={gotoDetail}
        />
      ))
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
      <div className="py-3 text-xl font-semibold">
        个人提供（Jay Zhou）
      </div>
      <div className="grid grid-cols-5 gap-x-5 gap-y-10">
        <Card info={customCard.current} getPlaylists={getJayPlaylists} gotoDetail={() => {}} />
      </div>
    </div>
  )
})

Recommend.displayName = 'Recommend'
export default Recommend
