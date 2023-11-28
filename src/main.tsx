// import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import './style/index.less'
import './main.css'
import './request'
import { HotKeys, type KeyMap } from 'react-hotkeys'

// 生产环境下 阻止默认快捷键操作
const keyMap: KeyMap = {
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
}

const handler = (event?: KeyboardEvent) => {
  event?.preventDefault()
  console.log('Browser shortcut detected!')
}

const handlers: Record<string, (keyEvent?: KeyboardEvent) => void> = {}

Object.keys(keyMap).forEach(key => {
  handlers[key] = handler
})

// 阻止鼠标右键默认事件
const allowTags = ['INPUT', 'TEXTAREA']
document.addEventListener('contextmenu', (e) => {
  if (allowTags.includes((e.target as HTMLInputElement).tagName)) return
  e.preventDefault()
})

const root: HTMLElement = document.getElementById('root')!
ReactDOM.createRoot(root).render(
  // <StrictMode>
  <Provider store={store}>
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <App />
    </HotKeys>
  </Provider>
  // </StrictMode>
)
