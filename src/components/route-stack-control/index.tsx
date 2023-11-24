import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'

const RouteStackControl = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const [routeStack, setRouteStack] = useState([location.pathname])
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0)

  // 使用 useEffect 监听路由变化
  useEffect(() => {
    console.log(routeStack)
    if (navigationType === 'PUSH') {
      setRouteStack((prevRouteStack) => {
        const newRouteStack = prevRouteStack.slice(0, prevRouteStack.length - currentRouteIndex)
        if (newRouteStack[newRouteStack.length - 1] !== location.pathname) {
          newRouteStack.push(location.pathname)
        }
        return newRouteStack
      })
      setCurrentRouteIndex(0)
    } else if (navigationType === 'REPLACE') {
      setRouteStack((prevRouteStack) => [
        ...prevRouteStack.slice(0, prevRouteStack.length - currentRouteIndex - 1),
        location.pathname
      ])
      setCurrentRouteIndex(0)
    }
  }, [location, navigationType])

  // 处理后退按钮点击事件
  const handleGoBack = () => {
    if (currentRouteIndex < routeStack.length - 1) {
      setCurrentRouteIndex(currentRouteIndex + 1)
      navigate(routeStack[routeStack.length - 2 - currentRouteIndex])
    }
  }

  // 处理前进按钮点击事件
  const handleGoForward = () => {
    if (currentRouteIndex > 0) {
      setCurrentRouteIndex(currentRouteIndex - 1)
      navigate(routeStack[routeStack.length - currentRouteIndex])
    }
  }

  // 检查是否可以后退或前进
  const canGoBack = currentRouteIndex < routeStack.length - 1
  const canGoForward = currentRouteIndex > 0

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

export default RouteStackControl
