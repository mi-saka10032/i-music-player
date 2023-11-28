import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import DisableHotKeys from './components/disableHotKeys'
import store from './store'
import './style/index.less'
import './main.css'
import './request'

const root: HTMLElement = document.getElementById('root')!
ReactDOM.createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <DisableHotKeys>
        <App />
      </DisableHotKeys>
    </Provider>
  </StrictMode>
)
