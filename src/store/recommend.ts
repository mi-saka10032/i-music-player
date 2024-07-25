import { createAtomWithIndexedDB } from './persist'

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
  initialValue: initialMap
})
