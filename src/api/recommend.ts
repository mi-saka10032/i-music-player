import tauriClient from '@/request'

/** 获取每日推荐歌单(需要登录) */
export const getRecommendResource = async () => await tauriClient.get<ResourceListsRes>('/recommend/resource')

/**
 * 推荐歌单
 * @param {Object} params { limit: 1 }
 */
export const getPersonalized = async (params?: { limit?: number }) => {
  return await tauriClient.get<PlayListsRes>('/personalized', params)
}
