import tauriClient from '@/request'
import { Body, fetch } from '@tauri-apps/api/http'
import { CUSTOM_ID, CUSTOM_NAME } from '@/utils/constant'

export const getJaySongs = async (): Promise<CustomDetail> => {
  const { link, options } = await tauriClient.tauriGetFetchOption('GET', '/songs/jay', {})
  // JSON对象反序列化后再填入fetch参数，防止二次JSON化
  const payload = JSON.parse(options.body?.payload as string)
  const result = await fetch<CustomSongsRes>(link, {
    method: options.method,
    body: Body.json(payload)
  })
  return {
    customId: CUSTOM_ID,
    customName: CUSTOM_NAME,
    list: result?.data?.data?.list ?? []
  }
}
