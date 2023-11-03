import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import './style/index.less'
import './main.css'
import './request'

const root: HTMLElement = document.getElementById('root')!
ReactDOM.createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

// 阻止鼠标右键默认事件
const allowTags = ['INPUT', 'TEXTAREA']
document.addEventListener('contextmenu', (e) => {
  if (allowTags.includes((e.target as HTMLInputElement).tagName)) return
  e.preventDefault()
})
