import { memo, useCallback, useEffect, useMemo } from 'react'
import { GlobalHotKeys, type KeyMap } from 'react-hotkeys'

type Handler = Record<string, (keyEvent?: KeyboardEvent) => void>

// 禁用浏览器热键，让应用更接近原生
const DisableHotKeys = memo((props: React.PropsWithChildren<any>) => {
  const keyMap: KeyMap = useMemo(() => ({
    REFRESH: ['command+r', 'ctrl+r', 'F5'],
    FIND: ['command+f', 'ctrl+f'],
    NEW_WINDOW: ['command+n', 'ctrl+n'],
    PRINT: ['command+p', 'ctrl+p'],
    SAVE: ['command+s', 'ctrl+s'],
    OPEN: ['command+o', 'ctrl+o'],
    COPY: ['command+c', 'ctrl+c'],
    PASTE: ['command+v', 'ctrl+v'],
    CUT: ['command+x', 'ctrl+x'],
    SELECT_ALL: ['command+a', 'ctrl+a'],
    UNDO: ['command+z', 'ctrl+z'],
    REDO: ['command+shift+z', 'ctrl+shift+z', 'ctrl+y']
  }), [])

  const handler = useCallback((event?: KeyboardEvent) => {
    event?.preventDefault()
    console.log('Browser shortcut detected!')
  }, [])

  const handlers = useMemo<Handler>(() => {
    const obj: Handler = {}
    return Object.keys(keyMap).reduce((target, key) => {
      target[key] = handler
      return target
    }, obj)
  }, [])

  // 阻止鼠标右键默认事件
  useEffect(() => {
    const allowTags = ['INPUT', 'TEXTAREA']
    document.addEventListener('contextmenu', (e) => {
      if (allowTags.includes((e.target as HTMLInputElement).tagName)) return
      e.preventDefault()
    })
  }, [])

  // 仅生产环境下禁用全局热键
  return (
    import.meta.env.PROD
      ? <GlobalHotKeys keyMap={keyMap} handlers={handlers}>{props.children}</GlobalHotKeys>
      : props.children
  )
})

DisableHotKeys.displayName = 'GlobalHotKeys'
export default DisableHotKeys
