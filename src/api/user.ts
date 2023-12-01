import tauriClient from '@/request'

// 登录后调用有效
export const getAccountInfo = async () => await tauriClient.get<AccountInfoRes>('/user/account')

// 获取我喜欢的音乐列表
export const getLikeLists = async (uid: number) => await tauriClient.get<FavoriteRes>('/likelist', { uid })

// 登录后调用有效 获取用户歌单
export const getUserPlaylist = async (uid: number) => await tauriClient.get<UserPlaylistsRes>('/user/playlist', { uid })
