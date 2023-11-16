import { memo, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchPlaylistDetail, setAutoplay, setLoading } from '@/store/playlist'
import Card from './card'
import SwiperComponent from '@/components/swiper'

const Recommend = memo(() => {
  const { cookie } = useAppSelector(state => state.user)
  const { banners, personalizedPlaylist, recommendList } = useAppSelector(state => state.cache)
  const dispatch = useAppDispatch()

  const getPlaylists = useCallback((id: number, autoplay: boolean) => {
    // 开启列表栏loading
    dispatch(setLoading(true))
    // 使用/不使用自动播放
    dispatch(setAutoplay(autoplay))
    // 获取歌单列表
    void dispatch(fetchPlaylistDetail(id))
  }, [])

  const CurRecommendList = useMemo(() => {
    if (cookie.length > 0) {
      return recommendList.map(item => {
        const playList: PersonalLists[number] = { ...item, playCount: item.playcount }
        return (<Card key={item.id} info={playList} getPlaylists={getPlaylists} />)
      })
    } else {
      return personalizedPlaylist.map(item => (<Card key={item.id} info={item} getPlaylists={getPlaylists} />))
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
