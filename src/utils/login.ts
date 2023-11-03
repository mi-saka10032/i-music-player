import { LOGIN_SUCCESS, LOGIN_WINDOW_NAME } from '@/common/constants'
import { type UnlistenFn, listen } from '@tauri-apps/api/event'
import { createWebviewWindow, getWindowByLabel } from './window'

interface LoginPayload { cookie: string }

// 初始化登录窗口
export async function initLogin () {
  let unlistenLoginSuccess: UnlistenFn | undefined
  let unlistenWindowClose: UnlistenFn | undefined

  function unlisten () {
    unlistenWindowClose != null && unlistenWindowClose()
    unlistenLoginSuccess != null && unlistenLoginSuccess()
  }

  return await new Promise<LoginPayload>(async (resolve, reject) => {
    const loginWin = await createWebviewWindow({
      label: LOGIN_WINDOW_NAME,
      url: '/login',
      acceptFirstMouse: true,
      alwaysOnTop: true,
      center: true,
      width: 350,
      height: 530,
      hiddenTitle: true,
      resizable: false,
      skipTaskbar: true,
      titleBarStyle: 'overlay'
    })
    // 关闭窗口
    unlistenWindowClose = await loginWin.onCloseRequested(() => {
      unlisten()
      reject({ message: '登录窗口被关闭' })
    })
    // 登录成功后关闭窗口
    unlistenLoginSuccess = await listen(LOGIN_SUCCESS, ({ payload }: { payload: LoginPayload }) => {
      unlisten()
      resolve(payload)
    })
  })
}

export function getLoginWindow () {
  return getWindowByLabel(LOGIN_WINDOW_NAME)
}
