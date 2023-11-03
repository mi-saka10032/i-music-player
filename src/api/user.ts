import tauriClient from '@/request'

// 登录后调用有效
export const getAccountInfo = async () =>
  await tauriClient.get<AccountInfoRes>('/user/account')
