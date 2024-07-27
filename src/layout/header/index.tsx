import { type PropsWithChildren, memo, useMemo } from 'react'
import RouteStackControl from '@/components/routeStackControl'
import NavBar from '@/layout/header/navBar'
import SettingsBar from './settings-bar'
import { siderWidth } from '../style'
import classNames from 'classnames'
import PlayerLogo from '@/assets/logo/index.png'

interface HeaderProps {
  showDetail: boolean
}

const Header = memo((props: PropsWithChildren<HeaderProps>) => {
  const switchHeaderVisibility = useMemo(() => {
    return props.showDetail ? 'invisible' : 'visible'
  }, [props.showDetail])

  return (
    <div className="flex w-full h-full">
      <div
        className={classNames('bg-[#f6f6f6]', { 'bg-[#f8f8f8]': props.showDetail })}
        style={{ width: siderWidth }}
      >
        <div data-tauri-drag-region className="pr-4 ml-4 flex h-full justify-between items-center">
          <img src={PlayerLogo} className={classNames('w-10 h-10', switchHeaderVisibility)} />
          <RouteStackControl className={switchHeaderVisibility} />
        </div>
      </div>
      <div className="flex-auto bg-[#f8f8f8] backdrop-blur-xl">
        <div data-tauri-drag-region className="flex justify-between items-center h-full pl-8 pr-8 mr-4">
          <div className={classNames('flex items-center', switchHeaderVisibility)}>
            <NavBar />
            { props.children }
          </div>
          <SettingsBar />
        </div>
      </div>
    </div>
  )
})

Header.displayName = 'Header'
export default Header
