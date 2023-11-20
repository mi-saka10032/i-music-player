import { type PropsWithChildren, memo, useCallback, useMemo } from 'react'
import RouteStackControl from '@/components/route-stack-control'
import NavBar from '@/layout/header/navBar'
import SettingsBar from './settings-bar'
import ArrowDown from '@/assets/svg/arrow-down.svg?react'

interface HeaderProps {
  detailRef: React.MutableRefObject<boolean>
  showDetail: boolean
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
}

const Header = memo((props: PropsWithChildren<HeaderProps>) => {
  // 切换Detail显示/隐藏
  const switchDetailStatus = useCallback(() => {
    props.detailRef.current = false
    props.setShowDetail(props.detailRef.current)
  }, [])

  const switchDetailClass = useMemo<string>(() => {
    return props.showDetail ? '' : 'hidden'
  }, [props.showDetail])

  const switchHeaderBG = useMemo<string>(() => {
    return props.showDetail ? 'bg-[#f8f8f8]' : ''
  }, [props.showDetail])

  const switchHeaderClass = useMemo<string>(() => {
    return props.showDetail ? 'hidden' : ''
  }, [props.showDetail])

  return (
    <>
      <div className={`w-[200px] h-full bg-[#f6f6f6] ${switchHeaderBG}`}></div>
      <div className={`flex-auto w-0 h-full bg-[#f8f8f8]/90 backdrop-blur-xl ${switchHeaderBG}`}></div>
      <div
        data-tauri-drag-region
        className="absolute w-full h-full left-0 top-0"
      >
        <ArrowDown
          data-tauri-drag-region
          className={`absolute left-[80px] top-[15%] w-5 h-5 cursor-pointer ${switchDetailClass}`}
          onClick={switchDetailStatus}
        />
        <div className={switchHeaderClass}>
          <div className="absolute bottom-2 left-[120px]">
            <RouteStackControl />
          </div>
          <div className="absolute top-2/4 left-[230px] -translate-y-[36%]">
            <NavBar />
            {props.children}
          </div>
        </div>
        <div className="absolute top-2/4 right-3 -translate-y-[36%]">
          <SettingsBar />
        </div>
      </div>
    </>
  )
})

Header.displayName = 'Header'
export default Header
