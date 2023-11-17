import { type MouseEvent, memo, useEffect, useState, useRef, useCallback } from 'react'
import { QueueContext } from './context/queue'
import { fetchRecommendData } from '@/store/cache'
import { useAppDispatch } from '@/hooks'
import Content from './content'
import Footer from './footer'
import Header from './header'
import Sider from './sider'
import PlayQueue from './sider/playQueue'

const Layout = memo(() => {
  const dispatch = useAppDispatch()
  const [showQueue, setShowQueue] = useState(false)

  const footerRef = useRef<HTMLDivElement>(null)
  const queueRef = useRef<HTMLDivElement>(null)
  // 当鼠标点击在非列表栏或底栏触发时，强制隐藏列表栏
  const handleContainerClick = useCallback((e: MouseEvent) => {
    if (footerRef.current == null || queueRef.current == null) {
      return
    }
    const target = e.target as HTMLElement
    if (!(footerRef.current?.contains(target) || queueRef.current?.contains(target))) {
      if (showQueue) {
        setShowQueue(() => false)
      }
    }
  }, [showQueue])

  useEffect(() => {
    void dispatch(fetchRecommendData())
  }, [])

  return (
    <QueueContext.Provider value={{ showQueue, setShowQueue }}>
      <div
        className='relative grid grid-cols-[200px_1fr] grid-rows-[1fr_60px] w-full h-full m-0 p-0 overflow-hidden'
        onClick={handleContainerClick}
      >
        <Header />
        <Sider />
        <Content />
        <Footer ref={footerRef} />
        <PlayQueue ref={queueRef}className={ showQueue ? '-translate-x-[30rem] opacity-100' : 'opacity-0' } />
      </div>
    </QueueContext.Provider>
  )
})

Layout.displayName = 'Layout'
export default Layout
