import tauriClient from '@/request'
import { Body, fetch } from '@tauri-apps/api/http'

export const getJaySongs = async (): Promise<CustomDetail> => {
  const { link, options } = await tauriClient.tauriGetFetchOption('GET', '/songs/jay', {})
  // JSON对象反序列化后再填入fetch参数，防止二次JSON化
  const payload = JSON.parse(options.body?.payload as string)
  const result = await fetch<CustomSongsRes>(link, {
    method: options.method,
    body: Body.json(payload)
  })
  const customId = 6935838229622784
  const customName = '周杰伦'
  return {
    customId,
    customName,
    list: result?.data?.data?.list ?? []
  }
}
