import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DisableHotKeys from './components/disableHotKeys'
import './style/index.less'
import './main.css'

const root: HTMLElement = document.getElementById('root')!
ReactDOM.createRoot(root).render(
  // <StrictMode>
  <DisableHotKeys>
    <App />
  </DisableHotKeys>
  // </StrictMode>
)
