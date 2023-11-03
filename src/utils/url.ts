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
