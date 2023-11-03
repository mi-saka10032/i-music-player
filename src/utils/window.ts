import { WebviewWindow, getCurrent, type WindowOptions } from '@tauri-apps/api/window'

interface CreateWindowOptions extends WindowOptions {
  label: string
}

export async function createWebviewWindow (options: CreateWindowOptions): Promise<WebviewWindow> {
  const { label, ...rest } = options

  return await new Promise((resolve, reject) => {
    const webview = new WebviewWindow(label, rest)
    void webview.once('tauri://created', function () {
      resolve(webview)
    })
    void webview.once('tauri://error', reject)
  })
}

export function closeWindow (win: WebviewWindow): void {
  void win.close()
}

export function focusWindow (win: WebviewWindow): void {
  void win.unminimize()
  void win.setFocus()
}

export function getWindowByLabel (label: string): WebviewWindow | null {
  return WebviewWindow.getByLabel(label)
}

export function closeCurrentWindow (): void {
  const currentWindow = getCurrent()
  if (currentWindow != null) {
    closeWindow(currentWindow)
  }
}

export const isTauriEnv = window.__TAURI__ != null
