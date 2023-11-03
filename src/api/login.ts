import { fetch } from '@tauri-apps/api/http'
import QRCode from 'qrcode'
import tauriClient from '@/request'
import { isTauriEnv } from '@/utils'

export const getLoginQrKey = async () =>
  await tauriClient.get<LoginKeyRes>('/login/qr/key')

export const loginQrCreate = async (params: { key: string, qrimg: boolean }): Promise<LoginCodeRes> => {
  const url = '/login/qr/create'
  // Tauri本地使用qrcode库来生成二维码
  if (isTauriEnv) {
    const { link } = await tauriClient.tauriGetFetchOption('GET', url, params)
    // base64 QR码的本质是携带unikey的url链接
    const qrurl = link
    const qrimg = await QRCode.toDataURL(qrurl)
    return {
      code: 200,
      data: { qrurl, qrimg }
    }
  }
  return await tauriClient.get(url, params)
}

export const loginQrCheck = async (params: { key: string }): Promise<LoginCheckRes> => {
  // 需要操作fetch返回值的rawHeaders，手动调用fetch
  const { link, options } = await tauriClient.tauriGetFetchOption('GET', '/login/qr/check', params)
  return await fetch(link, options)
}

export const getLoginStatus = async () =>
  await tauriClient.get('/login/status')

export default {
  getLoginQrKey,
  loginQrCreate,
  loginQrCheck,
  getLoginStatus
}
