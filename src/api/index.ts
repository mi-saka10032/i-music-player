import tauriClient from '@/request'
export * from './recommend'
export * from './user'
export * from './login'
export * from './detail'

export const getBanners = async (params?: { type?: BannerType }) => {
  return await tauriClient.get<BannersRes>('/banner', params)
}
