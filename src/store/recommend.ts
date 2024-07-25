import { useCallback, startTransition } from 'react'
import { useAtom } from 'jotai'
import { createAtomWithIndexedDB } from './persist'
import { getBanners, getPersonalized, getRecommendResource } from '@/api'
import { getCookie } from '@/utils'

export interface RecommendMap {
  banners: Banners
  personalizedPlaylist: PersonalLists
  recommendList: ResourceLists
}

const initialMap: RecommendMap = {
  banners: [],
  personalizedPlaylist: [],
  recommendList: []
}

export const RECOMMEND_CACHE_NAME = 'recommend'

export const recommendAtom = createAtomWithIndexedDB<RecommendMap>({
  cacheName: RECOMMEND_CACHE_NAME,
  enableInitialCache: true,
  initialValue: initialMap
})

export function useRecommend () {
  const [recommendMap, setRecommendMap] = useAtom(recommendAtom)

  const fetchRecommendMap = useCallback(async () => {
    const data: RecommendMap = {
      banners: [],
      personalizedPlaylist: [],
      recommendList: []
    }
    const fetchList: Array<Promise<any>> = [getBanners().then(res => data.banners = res.banners)]
    if (getCookie().length > 0) {
      fetchList.push(getRecommendResource().then(res => data.recommendList = res.recommend?.slice(0, 10)))
    } else {
      fetchList.push(getPersonalized().then(res => data.personalizedPlaylist = res.result?.slice(0, 10)))
    }
    await Promise.allSettled(fetchList)
    startTransition(() => {
      void setRecommendMap(data)
    })
  }, [])

  return {
    recommendMap,
    fetchRecommendMap
  }
}
