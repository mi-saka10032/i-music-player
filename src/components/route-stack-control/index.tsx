import { type FC, useState, useEffect } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'

// Go/Back路由按钮
const RouteStackControl: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const [routeStack, setRouteStack] = useState<string[]>([])
  const [routeStackIndex, setRouteStackIndex] = useState(0)
  // 使用 useEffect 监听路由变化
  useEffect(() => {
    if (navigationType === 'PUSH') {
      setRouteStack((prevRouteStack) => [...prevRouteStack, location.pathname])
      setRouteStackIndex(0)
    } else if (navigationType === 'REPLACE') {
      setRouteStack((prevRouteStack) => [
        ...prevRouteStack.slice(0, prevRouteStack.length - 1),
        location.pathname
      ])
      setRouteStackIndex(0)
    }
  }, [location])
  // 处理后退按钮点击事件
  const handleGoBack = () => {
    navigate(-1)
    setRouteStackIndex((prevRouteStackIndex) =>
      Math.min(prevRouteStackIndex + 1, routeStack.length - 1)
    )
  }
  // 处理前进按钮点击事件
  const handleGoForward = () => {
    navigate(1)
    setRouteStackIndex((prevRouteStackIndex) =>
      Math.max(prevRouteStackIndex - 1, 0)
    )
  }
  // 检查是否可以后退或前进
  const canGoBack = routeStackIndex < routeStack.length - 1
  const canGoForward = routeStackIndex > 0
  return (
    <div>
      <button
        className="iconfont icon-al w-7 h-7 leading-7 text-center rounded-full pr-0.5 text-ct enabled:hover:bg-[#e9e9e9] disabled:opacity-10"
        onClick={handleGoBack}
        disabled={!canGoBack}
        title="后退"
      ></button>
      <button
        className="iconfont icon-ar w-7 h-7 leading-7 text-center rounded-full pl-0.5 text-ct enabled:hover:bg-[#e9e9e9] disabled:opacity-10 ml-4"
        onClick={handleGoForward}
        disabled={!canGoForward}
        title="前进"
      ></button>
    </div>
  )
}

RouteStackControl.displayName = 'RouteStackControl'
export default RouteStackControl
