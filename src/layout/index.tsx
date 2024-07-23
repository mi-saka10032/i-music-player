import { type MouseEvent, memo, useEffect, useState, useRef, useCallback, useMemo, lazy } from 'react'
import { message } from 'antd'
import { PlayerEvent, playerInstance } from '@/core/player'
import { footerHeight, siderWidth, topHeight } from './style'

import Header from './header'
import Content from './content'
import Footer from './footer'
import LeftSider from './leftSider'
const RightQueue = lazy(async () => await import('./rightQueue'))
const Detail = lazy(async () => await import('./detail'))

const Layout = memo(() => {
  /** 列表栏的显示/隐藏 */
  // 列表栏的显示隐藏状态ref，传递给footer做修改，以避免footer不必要的更新
  const queueStatusRef = useRef(false)
  // 列表栏的显示隐藏状态state，传递给queue控制queue的显示/隐藏
  const [showQueue, setShowQueue] = useState(queueStatusRef.current)

  const footerRef = useRef<HTMLDivElement>(null)

  const queueRef = useRef<HTMLDivElement>(null)

  const switchQueueClass = useMemo<string>(() => {
    return showQueue ? 'opacity-1' : 'translate-x-[30rem] opacity-0'
  }, [showQueue])

  const operateQueueStatus = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const footer = footerRef.current as HTMLElement
    const queue = queueRef.current as HTMLElement
    if (!(footer.contains(target) || queue.contains(target)) && showQueue) {
      queueStatusRef.current = false
      setShowQueue(queueStatusRef.current)
    }
  }, [showQueue])
  /** 列表栏的显示/隐藏 */

  /** 音乐详情页的显示/隐藏 */
  // 列表栏的显示隐藏状态ref，传递给footer做修改，以避免footer不必要的更新
  const detailRef = useRef(false)
  // 详情页的显示隐藏状态state，传递给detail控制detail的显示/隐藏以及header的隐藏/显示
  const [showDetail, setShowDetail] = useState(detailRef.current)

  const switchDetailClass = useMemo<string>(() => {
    return showDetail ? 'top-0 opacity-1' : 'top-full opacity-0'
  }, [showDetail])
  /** 音乐详情页的显示/隐藏 */

  // 无效音频的提示信息API
  const [messageApi, contextHolder] = message.useMessage()

  const showInvalidTips = useCallback(() => {
    void messageApi.open({
      type: 'error',
      content: '音乐已失效或没有版权'
    })
  }, [])

  /** 挂载时触发 */
  useEffect(() => {
    playerInstance.on(PlayerEvent.INVALID, showInvalidTips)
    return () => {
      playerInstance.off(PlayerEvent.INVALID, showInvalidTips)
      playerInstance.removeUrlCleaner()
    }
  }, [])

  return (
    <div
      className='relative grid w-full h-full m-0 p-0 overflow-hidden rounded-2xl'
      style={{
        gridTemplateRows: `${topHeight} 1fr ${footerHeight}`,
        gridTemplateColumns: `${siderWidth} 1fr`
      }}
      onClick={operateQueueStatus}
      >
      {/* Header 占据网格第1行，第1-3列网格线 */}
      <div
        className="flex relative z-40 col-start-1 col-end-3"
        style={{ height: topHeight }}
        >
        <Header showDetail={showDetail} />
      </div>
      {/* LeftSider 占据网格第2行，默认第1-2列网格线 */}
      <div className="bg-[#ededed] overflow-hidden" >
        <LeftSider />
      </div>
      {/* Content 占据网格第2行，默认第2-3列网格线 */}
      <div className="flex overflow-hidden">
        <Content />
      </div>
      {/* Footer 占据网格第3行，默认第1-3列网格线 */}
      <div
        ref={footerRef}
        className="relative z-40 w-full col-start-1 col-end-3 bg-white rounded-b-2xl"
        >
        <Footer
          queueStatusRef={queueStatusRef}
          detailRef={detailRef}
          setShowQueue={setShowQueue}
          setShowDetail={setShowDetail}
        />
      </div>
      {/* RightQueue fixed */}
      <div
        ref={queueRef}
        className={`fixed top-0 right-0 z-30 flex flex-col w-[30rem] h-full transition-all duration-500 ${switchQueueClass}`}
        style={{ paddingTop: topHeight, paddingBottom: footerHeight }}
        >
        <RightQueue showQueue={showQueue} />
      </div>
      {/* Detail fixed */}
      <div
        className={`fixed z-20 left-0 w-full h-full transition-opacity duration-500 bg-[#f8f8f8] rounded-2xl ${switchDetailClass}`}
        style={{ paddingTop: topHeight, paddingBottom: footerHeight }}
        >
        <Detail detailRef={detailRef} setShowDetail={setShowDetail} />
      </div>
      {contextHolder}
    </div>
  )
})

Layout.displayName = 'Layout'
export default Layout
