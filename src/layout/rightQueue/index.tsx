import { memo, useMemo, useEffect, useRef, type CSSProperties, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { playerStatusAtom, queueLoadingAtom, songActiveIdAtom, songActiveIndexAtom, songListsAtom } from '@/store'
import { useFetchPlaylists } from '@/hooks'
import { Divider, Button } from 'antd'
import AutoSizer from 'react-virtualized-auto-sizer'
import { type Align, FixedSizeList } from 'react-window'
import { playerInstance } from '@/core'
import LoadingContainer from '@/components/loadingContainer'
import LoadingInstance from '@/components/loadingInstance'
import {
  artistsArrayTrans,
  durationTrans,
  generateZebraClass,
  highlightArtistClass,
  highlightDurationClass,
  highlightNameClass
} from '@/utils'

interface RightQueueProps {
  showQueue: boolean
}

// 固定行渲染元素
const FixedRow = memo(({
  index,
  style,
  data
}: {
  index: number
  style: CSSProperties
  data: SongData[] }) => {
  const item = data[index]

  const playStatus = useAtomValue(playerStatusAtom)

  const songActiveId = useAtomValue(songActiveIdAtom)

  const isPlayingClass = useMemo(() => {
    return playStatus === 'playing' ? 'icon-play' : 'icon-pause'
  }, [playStatus])

  const handleChangeSongId = useCallback((id: number) => {
    playerInstance.setId(id)
  }, [])

  return item != null
    ? (
      <div
        key={item.id}
        className={`relative flex justify-between items-center space-x-1 w-full px-[8px] group ${generateZebraClass(index)}`}
        style={style}
        onDoubleClick={() => { handleChangeSongId(item.id) }}
      >
        <i
          key={`icon:${item.id}`}
          className={`iconfont text-[12px] font-bold text-primary ${isPlayingClass} ${item.id === songActiveId ? 'visible' : 'invisible'}`}
        />
        <div
          title={item.name}
          className={`w-6/12 ${highlightNameClass(songActiveId, item.id)}`}
        >
          {item.name}
        </div>
        <div
          title={artistsArrayTrans(item.artists)}
          className={`w-4/12 ${highlightArtistClass(songActiveId, item.id)}`}
        >
          {artistsArrayTrans(item.artists)}
        </div>
        <div className={`w-1/12 ${highlightDurationClass(songActiveId, item.id)}`}>
          {durationTrans(item.time ?? 0)}
        </div>
      </div>
      )
    : null
})
FixedRow.displayName = 'FixedRow'

const RightQueue = memo((props: RightQueueProps) => {
  // 固定元素高度
  const fixedItemHeight = useRef(36)

  // 固定行渲染列表Ref
  const fixedListRef = useRef<FixedSizeList>(null)

  const { clearPlaylists } = useFetchPlaylists()

  const queueLoading = useAtomValue(queueLoadingAtom)

  const songLists = useAtomValue(songListsAtom)

  const songActiveIndex = useAtomValue(songActiveIndexAtom)

  const songListsSize = useMemo(() => songLists.length, [songLists])

  // 切换显示时，存在播放列表，对当前播放的歌曲位置进行滚动条复位
  useEffect(() => {
    if (
      props.showQueue &&
      songListsSize > 0 &&
      songListsSize > songActiveIndex
    ) {
      const align: Align = songListsSize >= 30 ? 'center' : 'start'
      fixedListRef.current?.scrollToItem(songActiveIndex, align)
    }
  }, [props.showQueue, songLists, songActiveIndex])

  return (
    <>
      <div className="max-h-[100px] px-5 bg-white shadow-xl">
        <h2 className="py-5 text-xl font-semibold">当前播放</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-ctd">总{songListsSize}首</p>
          <Button
            type="link"
            className="py-0 text-sm"
            onClick={clearPlaylists}
          >
            清空列表
          </Button>
        </div>
        <Divider className="mt-4 mb-0" type="horizontal" dashed={true} />
      </div>
      <div id="container" className="relative flex-1 min-h-[460px] bg-white">
        <LoadingContainer loading={queueLoading} fallback={<LoadingInstance />}>
          <AutoSizer>
            {({ width, height }: { width: number, height: number }) => (
              <FixedSizeList
                ref={fixedListRef}
                className={songListsSize > 0 ? '' : 'hidden'}
                width={width}
                height={height}
                itemData={songLists}
                itemCount={songListsSize}
                itemSize={fixedItemHeight.current}
                    >
                { FixedRow }
              </FixedSizeList>
            )}
          </AutoSizer>
          <div className={`${songListsSize > 0 ? 'hidden' : ''} mt-40 text-base text-ctd text-center`}>你还没有添加任何歌曲！</div>
        </LoadingContainer>
      </div>
    </>
  )
})

RightQueue.displayName = 'RightQueue'
export default RightQueue
