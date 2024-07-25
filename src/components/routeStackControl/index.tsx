import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'

// 路由链表节点
interface RouteNode {
  value: string
  next: RouteNode | null
  prev: RouteNode | null
}

const RouteStackControl = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  // 初始化路由节点
  const initialRouteNodeRef = useRef<RouteNode>({ value: location.pathname, next: null, prev: null })
  // 当前的路由节点
  const activeRouteNodeRef = useRef<RouteNode>(initialRouteNodeRef.current)
  // 前进、后台的禁用判断
  const [isBackDisabled, setIsBackDisabled] = useState(activeRouteNodeRef.current.prev == null)
  const [isForwardDisabled, setIsForwardDisabled] = useState(activeRouteNodeRef.current.next == null)

  // 使用 useEffect 监听路由变化
  useEffect(() => {
    if (navigationType === 'PUSH') {
      // 当PUSH的路由与当前路由节点值不同时，节点next一位
      if (activeRouteNodeRef.current.value !== location.pathname) {
        // 创建新节点
        const newNode: RouteNode = {
          value: location.pathname,
          next: null,
          prev: activeRouteNodeRef.current
        }
        // next一位
        activeRouteNodeRef.current.next = newNode
        // active指向新节点
        activeRouteNodeRef.current = newNode
      }
    } else if (navigationType === 'REPLACE') {
      // 替换当前节点值
      activeRouteNodeRef.current.value = location.pathname
    }
    setIsBackDisabled(activeRouteNodeRef.current.prev == null)
    setIsForwardDisabled(activeRouteNodeRef.current.next == null)
  }, [location, navigationType])

  // 处理后退按钮点击事件
  const handleGoBack = () => {
    if (activeRouteNodeRef.current.prev != null) {
      // prev一位
      activeRouteNodeRef.current = activeRouteNodeRef.current.prev
      // 跳转前一个路由
      navigate(activeRouteNodeRef.current.value)
    }
  }

  // 处理前进按钮点击事件
  const handleGoForward = () => {
    if (activeRouteNodeRef.current.next != null) {
      // next一位
      activeRouteNodeRef.current = activeRouteNodeRef.current.next
      // 跳转下一个路由
      navigate(activeRouteNodeRef.current.value)
    }
  }

  return (
    <div>
      <button
        className="iconfont icon-al w-7 h-7 leading-7 text-center rounded-full pr-0.5 text-ct enabled:hover:bg-[#e9e9e9] disabled:opacity-10"
        onClick={handleGoBack}
        disabled={isBackDisabled}
        title="后退"
      ></button>
      <button
        className="iconfont icon-ar w-7 h-7 leading-7 text-center rounded-full pl-0.5 text-ct enabled:hover:bg-[#e9e9e9] disabled:opacity-10 ml-4"
        onClick={handleGoForward}
        disabled={isForwardDisabled}
        title="前进"
      ></button>
    </div>
  )
}

export default RouteStackControl
