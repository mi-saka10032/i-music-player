import { type PropsWithChildren, memo } from 'react'
import RouteStackControl from '@/components/route-stack-control'
import NavBar from '@/layout/header/navBar'
import SettingsBar from './settings-bar'

const Header = memo(({ children }: PropsWithChildren) => {
  return (
    <div className="flex absolute z-50 top-[0] left-[0] w-full h-[50px] ">
      <div className="w-[200px] h-full bg-[#f6f6f6]"></div>
      <div className="flex-auto w-0 h-full bg-[#f8f8f8]/90 backdrop-blur-xl"></div>
      <div
        data-tauri-drag-region
        className="absolute w-full h-full left-0 top-0"
      >
        <div className="absolute bottom-2 left-[136px]">
          <RouteStackControl />
        </div>
        <div className="absolute top-2/4 left-[230px] -translate-y-[36%]">
          <NavBar />
          {children}
        </div>
        <div className="absolute top-2/4 right-3 -translate-y-[36%]">
          <SettingsBar />
        </div>
      </div>
    </div>
  )
})

Header.displayName = 'Header'
export default Header
