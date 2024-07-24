import { type CSSProperties, type FC, memo, forwardRef, useMemo, useRef } from 'react'

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
    (props, ref) => {
      const { className, width, height, itemCount, itemSize, scrollPosition } = props
      // 可见元素数量
      const visibleItems = useMemo<number>(() => Math.ceil(height / itemSize), [height, itemSize])
      // 总占位高度
      const totalHeight = useMemo<number>(() => itemCount * itemSize, [itemCount, itemSize])
      // 增加预渲染的元素数量
      const buffer = useRef(10) // 预渲染的额外元素数量
      // 起始节点索引（对于Detail详情页，Header内容占位接近10个元素数量，此处约等于向上预留20个元素）
      const startNode = useMemo<number>(() => {
        return Math.max(0, Math.floor(scrollPosition / itemSize) - visibleItems - buffer.current)
      }, [scrollPosition, itemSize, visibleItems])
      // 结束节点索引（加倍数量）
      const endNode = useMemo<number>(() => {
        return startNode + visibleItems * 2 + buffer.current * 3
      }, [startNode, visibleItems])
      // 偏移高度
      const offsetY = useMemo<number>(() => startNode * itemSize, [startNode, itemSize])
      // 可见元素数据切割
      const visibleItemsData = useMemo<any[]>(() => {
        return props.itemData.slice(startNode, endNode)
      }, [props.itemData, startNode, endNode])

      return (
        <div ref={ref} className={className} style={{ position: 'relative', width, height: '100%' }}>
          {/* 总占位高度元素 */}
          <div style={{ position: 'relative', width: '100%', height: totalHeight }} />
          <div style={{ position: 'absolute', top: offsetY, width: '100%' }}>
            {/* children组件渲染 */}
            {
              visibleItemsData.map((item, index) =>
                <props.children
                  key={(item.id ?? 0) + '' + index}
                  index={startNode + index}
                  style={{ height: itemSize }}
                  data={props.itemData}
                />
              )
            }
          </div>
        </div>
      )
    }
  )
)

VirtualList.displayName = 'VirtualList'
export default VirtualList
