import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DisableHotKeys from './components/disableHotKeys'
import PlayerInitiator from './PlayerInitiator'
import './style/index.less'
import './main.css'

const root: HTMLElement = document.getElementById('root')!
ReactDOM.createRoot(root).render(
  <StrictMode>
    <DisableHotKeys>
      <PlayerInitiator>
        <App />
      </PlayerInitiator>
    </DisableHotKeys>
  </StrictMode>
)
