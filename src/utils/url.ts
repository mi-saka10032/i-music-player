import { open } from '@tauri-apps/api/shell'
import { isTauriEnv } from './window'

export function openUrl (url: string) {
  if (isTauriEnv) {
    // 默认tauri窗口打开
    void open(url)
  } else {
    // window新窗口打开
    window.open(url, '_blank')
  }
}

export function formatImgUrl (url: string, sizes: number | string) {
  const param = `param=${sizes}y${sizes}`
  return `${url}${url.includes('?') ? '&' : '?'}${param}`
}

export function replaceHttpsUrl (url: string) {
  return url.replace(/^http/, 'https')
}
