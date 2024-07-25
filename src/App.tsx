import { RouterProvider } from 'react-router-dom'
import router from './router'
import DisableHotKeys from './components/disableHotKeys'
import PlayerInitiator from './PlayerInitiator'

function App () {
  return (
    <PlayerInitiator>
      <DisableHotKeys>
        <RouterProvider router={router} />
      </DisableHotKeys>
    </PlayerInitiator>
  )
}

export default App
