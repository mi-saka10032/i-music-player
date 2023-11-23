import { memo, useMemo, useEffect, useRef } from 'react'
import { Divider, Row, Col, Button } from 'antd'
// import OverlayScrollbarsComponent from '@/components/overlayscrollbars'
import AutoSizer from 'react-virtualized-auto-sizer'
import { type Align, FixedSizeList } from 'react-window'
import { type SongData } from '@/core/player'
import LoadingInstance from '@/components/loadingInstance'
import { type LocalPlayQueue, usePlayQueue } from '@/hooks/usePlayQueue'
import PlaySingleIcon from '@/assets/svg/play_single.svg?react'
import PauseSingleIcon from '@/assets/svg/pause_single.svg?react'

interface RightQueueProps {
  showQueue: boolean
  activeId: number
  activeIndex: number
  playStatus: MediaSessionPlaybackState
  loading: boolean
  playlists: SongData[]
  onIndexChange: (index: number) => void
  clearPlaylist: () => void
}

const RightQueue = memo((props: RightQueueProps) => {
  /** 列表左侧播放/暂停小图标展示 */
  const CoreIcon = useMemo(() => {
    return props.playStatus === 'paused' ? <PauseSingleIcon className="w-3.5 h-3.5" /> : <PlaySingleIcon className="w-3 h-3" />
  }, [props.playStatus])
  /** 列表左侧播放/暂停小图标展示 */

  /** 本地转化播放列表数据字段 */
  const localPlayQueue = usePlayQueue(props.playlists, props.activeId)
  /** 本地转化播放列表数据字段 */

  /** 固定行可见区域列表组件 */
  // 固定元素高度
  const fixedItemHeight = useRef(36)

  // 固定行渲染列表Ref
  const fixedListRef = useRef<FixedSizeList>(null)
  // 固定行渲染元素
  const FixedRow = memo(({ index, style, data }: { index: number, style: React.CSSProperties, data: LocalPlayQueue[] }) => {
    const item = data[index]
    return item != null
      ? (
        <Row
          key={item.id}
          className={`relative w-full px-[16px] py-[8px] group ${item.zebraClass}`}
          style={style}
          justify={'space-between'}
          align={'middle'}
          gutter={16}
          wrap={false}
          onDoubleClick={() => { props.onIndexChange(index) }}
        >
          {
            item.id === props.activeId
              ? (
                <div
                  key={`icon:${item.id}`}
                  className={'absolute-middle-y left-3'}
                >
                  { CoreIcon }
                </div>
                )
              : null
          }
          <Col
            title={item.name}
            span={14}
            className={item.songNameClass}
          >
            {item.name}
          </Col>
          <Col
            title={item.artistsName}
            span={6}
            className={item.artistClass}
          >
            {item.artistsName}
          </Col>
          <Col
            span={4}
            className={item.durationClass}
          >
            {item.duration}
          </Col>
        </Row>
        )
      : null
  })
  FixedRow.displayName = 'FixedRow'
  /** 固定行可见区域列表组件 */

  // 切换显示时，存在播放列表，对当前播放的歌曲位置进行滚动条复位
  useEffect(() => {
    if (
      props.showQueue &&
      localPlayQueue.length > 0 &&
      localPlayQueue.length > props.activeIndex
    ) {
      const align: Align = localPlayQueue.length >= 30 ? 'center' : 'start'
      fixedListRef.current?.scrollToItem(props.activeIndex, align)
    }
  }, [props.showQueue, localPlayQueue, props.activeIndex])

  return (
    <>
      <div className="h-[50px]"></div>
      <div className="max-h-[100px] px-5 bg-white shadow-xl">
        <h2 className="py-5 text-xl font-semibold">当前播放</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-ctd">总{localPlayQueue.length}首</p>
          <Button
            type="link"
            className="py-0 text-sm"
            onClick={props.clearPlaylist}
          >
            清空列表
          </Button>
        </div>
        <Divider className="mt-4 mb-0" />
      </div>
      <div id="container" className="relative flex-1 min-h-[460px] bg-white">
        <LoadingInstance loading={props.loading} />
        <div className={`mt-40 text-base text-ctd text-center ${!props.loading && localPlayQueue.length === 0 ? '' : 'hidden'}`}>你还没有添加任何歌曲！</div>
        <AutoSizer>
          {({ width, height }: { width: number, height: number }) => (
            <FixedSizeList
              className={!props.loading && localPlayQueue.length > 0 ? '' : 'hidden'}
              ref={fixedListRef}
              width={width}
              height={height}
              itemCount={localPlayQueue.length}
              itemData={localPlayQueue}
              itemSize={fixedItemHeight.current}
            >
              { FixedRow }
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
      <div className="h-[60px]"></div>
    </>
  )
})

RightQueue.displayName = 'RightQueue'
export default RightQueue
