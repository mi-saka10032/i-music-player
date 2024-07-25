import { startTransition, useCallback } from 'react'
import { useAtom } from 'jotai'
import { type RecommendMap, recommendAtom } from '@/store'
import { getBanners, getPersonalized, getRecommendResource } from '@/api'
import { getCookie } from '@/utils'

export function useRecommend () {
  const [recommendMap, setRecommendMap] = useAtom(recommendAtom)

  const fetchRecommendMap = useCallback(async () => {
    const data: RecommendMap = {
      banners: [],
      personalizedPlaylist: [],
      recommendList: []
    }
    const fetchList: Array<Promise<any>> = [getBanners().then(res => data.banners = res.banners)]

    const logged = getCookie().length > 0

    if (logged) {
      fetchList.push(getRecommendResource().then(res => data.recommendList = res.recommend?.slice(0, 10)))
    } else {
      fetchList.push(getPersonalized().then(res => data.personalizedPlaylist = res.result?.slice(0, 10)))
    }

    await Promise.allSettled(fetchList)

    if (
      (data.banners.length === 0) ||
      (logged && data.recommendList.length === 0) ||
      (!logged && data.personalizedPlaylist.length === 0)
    ) return

    startTransition(() => {
      setRecommendMap(data)
    })
  }, [])

  return {
    recommendMap,
    fetchRecommendMap
  }
}
