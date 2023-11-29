import { memo, useCallback, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, playNowById, playNowByCustom } from '@/hooks'
import Card from './card'
import SwiperComponent from '@/components/swiper'
import { CUSTOM_IMG } from '@/utils/constant'

const Recommend = memo(() => {
  const navigate = useNavigate()

  const { accountInfo } = useAppSelector(state => state.user)
  const { banners, personalizedPlaylist, recommendList } = useAppSelector(state => state.cache)

  const getPlaylists = playNowById()
  const getJayPlaylists = playNowByCustom()

  const gotoMusicDetail = useCallback((id: number) => {
    navigate(`/musicDetail/${id}`)
  }, [])

  // 个人音乐后台提供歌曲
  const customCard = useRef<PersonalLists[number]>({
    id: 0,
    name: 'Jay Zhou',
    picUrl: CUSTOM_IMG,
    playCount: 0
  })

  // 个人音乐后台提供详情
  const gotoCustomDetail = useCallback(() => {
    navigate('/musicDetail/custom')
  }, [])

  const CurRecommendList = useMemo(() => {
    if (accountInfo.account?.id != null) {
      return recommendList.map(item => {
        const playList: PersonalLists[number] = { ...item, playCount: item.playcount }
        return (
          <Card
            key={item.id}
            info={playList}
            getPlaylists={getPlaylists}
            gotoDetail={gotoMusicDetail}
           />
        )
      })
    } else {
      return personalizedPlaylist.map(item => (
        <Card
          key={item.id}
          info={item}
          getPlaylists={getPlaylists}
          gotoDetail={gotoMusicDetail}
        />
      ))
    }
  }, [accountInfo, personalizedPlaylist, recommendList])

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
        <Card info={customCard.current} getPlaylists={getJayPlaylists} gotoDetail={gotoCustomDetail} />
      </div>
    </div>
  )
})

Recommend.displayName = 'Recommend'
export default Recommend
