import { memo, useMemo, useEffect, useRef, useState } from 'react'
import { Divider, Row, Col, Button } from 'antd'
// import OverlayScrollbarsComponent from '@/components/overlayscrollbars'
import { FixedSizeList } from 'react-window'
import { type SongData } from '@/core/player'
import { durationTrans } from '@/utils/formatter'
import LoadingIcon from '@/assets/svg/loading.svg?react'
import PlaySingleIcon from '@/assets/svg/play_single.svg?react'
import PauseSingleIcon from '@/assets/svg/pause_single.svg?react'
import './index.css'

interface RightQueueProps {
  showQueue: boolean
  activeId: number
  activeIndex: number
  playStatus: MediaSessionPlaybackState
  loading: boolean
  playlists: SongData[]
  onLoaded: (isLoading: boolean) => void
  onIndexChange: (index: number) => void
  clearPlaylist: () => void
}

interface localPlayQueue {
  id: number
  name: string
  artistsName: string
  duration: string
  zebraClass: string
  songNameClass: string
  artistClass: string
  durationClass: string
}

const RightQueue = memo((props: RightQueueProps) => {
  /** 列表左侧播放/暂停小图标展示 */
  const CoreIcon = useMemo(() => {
    return props.playStatus === 'paused' ? <PauseSingleIcon className="w-3.5 h-3.5" /> : <PlaySingleIcon className="w-3 h-3" />
  }, [props.playStatus])
  /** 列表左侧播放/暂停小图标展示 */

  /** loading实例 */
  const LoadingInstance = memo(({ className }: { className: string }) => {
    return (
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}>
        <LoadingIcon className="animate-spin w-12 h-12" />
      </div>
    )
  })
  LoadingInstance.displayName = 'LoadingInstance'
  /** loading实例 */

  /** 本地转化播放列表数据字段 */
  const localPlayQueue = useMemo<localPlayQueue[]>(() => {
    const getArtistNames = (artists: AR[]): string => {
      return artists.map(item => item.name).join(' / ')
    }
    // 字体特殊高亮类名
    const highlightIdClass = (itemId: number, defaultColor: string): string => {
      return 'text-ellipsis text-sm ' + (itemId === props.activeId ? 'text-red-500 ' : defaultColor + 'group-hover:text-black ')
    }
    return props.playlists.map((item, index) => ({
      id: item.id,
      name: item.name,
      artistsName: getArtistNames(item.artists),
      duration: durationTrans(item.time ?? 0),
      zebraClass: index % 2 !== 0 ? 'bg-[#f6f6f6] hover:bg-[#f2f2f2] ' : 'bg-[#fdfdfd] hover:bg-[#f3f3f3] ',
      songNameClass: highlightIdClass(item.id, 'text-black '),
      artistClass: highlightIdClass(item.id, 'text-neutral-500 '),
      durationClass: highlightIdClass(item.id, 'text-teal-400 ')
    }))
  }, [props.playlists, props.activeId])
  /** 本地转化播放列表数据字段 */

  /** 固定行可见区域列表组件 */
  // 固定列表宽度
  const fixedListWidth = useRef('100%')
  // 固定元素高度
  const fixedItemHeight = useRef(36)
  // 固定列表高度(高度受 ResizeObserver 影响，需要作为state传递)
  const [fixedListHeight, setFixedListHeight] = useState(0)

  // 固定行渲染列表Ref
  const fixedListRef = useRef<FixedSizeList>(null)
  // 固定行渲染元素
  const FixedRow = memo(({ index, style, data }: { index: number, style: React.CSSProperties, data: localPlayQueue[] }) => {
    const item = data[index]
    return item != null
      ? (
        <div
          key={item.id}
          style={style}
          className={`relative playlist-item group ${item.zebraClass} px-[16px] py-[8px]`}
          onDoubleClick={() => { props.onIndexChange(index) }}
          >
          {
            item.id === props.activeId
              ? (
                <div
                  key={`icon:${item.id}`}
                  className={'absolute left-0.5 top-1/2 -translate-y-[50%]'}
                      >
                  { CoreIcon }
                </div>
                )
              : null
          }
          <Row
            className="w-full"
            justify={'space-between'}
            align={'middle'}
            gutter={16}
            wrap={false}
            >
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
        </div>
        )
      : null
  })
  FixedRow.displayName = 'FixedRow'
  /** 固定行可见区域列表组件 */

  // 播放列表依赖更新完毕后，关闭loading
  useEffect(() => {
    if (props.playlists.length > 0) {
      props.onLoaded(false)
    }
  }, [props.playlists])

  // container元素区域的resize动态调整高度，与相应的FixedSizeList动态高度调整
  useEffect(() => {
    const resizeObserver = new window.ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        // 处理垂直方向的固定列表高度变化
        setFixedListHeight(height)
      }
    })
    const container = document.getElementById('container') as HTMLDivElement
    resizeObserver.observe(container)
    return () => {
      resizeObserver.unobserve(container)
    }
  }, [])

  // 切换显示时，存在播放列表，对当前播放的歌曲位置进行滚动条复位
  useEffect(() => {
    if (
      props.showQueue &&
      localPlayQueue.length > 0 &&
      fixedListHeight > 0 &&
      localPlayQueue.length > props.activeIndex
    ) {
      fixedListRef.current?.scrollToItem(props.activeIndex, 'center')
    }
  }, [props.showQueue, localPlayQueue, props.activeIndex, fixedListHeight])

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
        <LoadingInstance className={props.loading ? '' : 'hidden'} />
        <div className={`mt-40 text-base text-ctd text-center ${!props.loading && localPlayQueue.length === 0 ? '' : 'hidden'}`}>你还没有添加任何歌曲！</div>
        <FixedSizeList
          className={`${!props.loading && localPlayQueue.length > 0 ? '' : 'hidden'} fixed_scroll`}
          ref={fixedListRef}
          width={fixedListWidth.current}
          height={fixedListHeight}
          itemCount={localPlayQueue.length}
          itemData={localPlayQueue}
          itemSize={fixedItemHeight.current}
        >
          { FixedRow }
        </FixedSizeList>
      </div>
      <div className="h-[60px]"></div>
    </>
  )
})

RightQueue.displayName = 'RightQueue'
export default RightQueue
