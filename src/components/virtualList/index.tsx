import { type CSSProperties, type FC, memo, forwardRef } from 'react'

interface FixedRowProps {
  index: number
  style: CSSProperties
  data: any[]
}

interface VirtualListProps {
  className?: string
  width: number
  height: number
  itemData: any[]
  itemCount: number
  itemSize: number
  scrollPosition: number
  children: FC<FixedRowProps>
}

// 手动实现虚拟列表，去除滚动条后可以通过外部scrollPosition手动跟随滚动。适用于包含Header内容的详情页
const VirtualList = memo(
  forwardRef<HTMLDivElement, VirtualListProps>(
    ({ className, width, height, itemData, itemCount, itemSize, scrollPosition, children: ChildrenComponent }, ref) => {
      // 可见元素数量
      const visibleItems = Math.ceil(height / itemSize)
      // 总占位高度
      const totalHeight = itemCount * itemSize
      // 增加预渲染的元素数量
      const buffer = 20 // 预渲染的额外元素数量
      // 起始节点索引
      const startNode = Math.max(0, Math.floor(scrollPosition / itemSize) - visibleItems - buffer)
      // 结束节点索引（双倍数量）
      const endNode = startNode + visibleItems * 2 + buffer * 2
      // 偏移高度
      const offsetY = startNode * itemSize
      // 可见元素数据切割
      const visibleItemsData = itemData.slice(startNode, endNode)

      return (
        <div ref={ref} className={className} style={{ position: 'relative', width, height: '100%' }}>
          <div style={{ position: 'absolute', top: offsetY, width: '100%' }}>
            {/* children组件渲染 */}
            {visibleItemsData.map((item, index) => <ChildrenComponent key={(item.id ?? 0) + '' + index} index={startNode + index} style={{ height: itemSize }} data={itemData} />)}
          </div>
          {/* 顶部偏移占位元素 */}
          <div style={{ height: offsetY }}></div>
          {/* 底部偏移占位元素 */}
          <div style={{ height: totalHeight - offsetY - visibleItemsData.length * itemSize }}></div>
        </div>
      )
    })
)

VirtualList.displayName = 'VirtualList'
export default VirtualList
