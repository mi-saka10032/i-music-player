import { memo } from 'react'
import QRLogin from './qr-login'

const Login = memo(() => {
  return (
    <div data-tauri-drag-region className="w-full h-full">
      <QRLogin />
    </div>
  )
})

Login.displayName = 'Login'
export const Component = Login
export default Login
