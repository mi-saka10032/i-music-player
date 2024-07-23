import { memo, useMemo, useEffect, useRef, type CSSProperties, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { autoplayAtom, playerStatusAtom, queueLoadingAtom, songActiveIdAtom, songActiveIndexAtom, songListsAtom, useFetchPlaylists } from '@/store'
import { Divider, Row, Col, Button } from 'antd'
import AutoSizer from 'react-virtualized-auto-sizer'
import { type Align, FixedSizeList } from 'react-window'
import { playerInstance, type SongData } from '@/core/player'
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
      <Row
        key={item.id}
        className={`relative w-full px-[16px] py-[8px] group ${generateZebraClass(index)}`}
        style={style}
        justify={'space-between'}
        align={'middle'}
        gutter={16}
        wrap={false}
        onDoubleClick={() => { handleChangeSongId(item.id) }}
    >
        {
        item.id === songActiveId
          ? (
            <div
              key={`icon:${item.id}`}
              className={'absolute-middle-y left-3'}
            >
              <i className={`iconfont text-sm leading-none font-bold text-primary ${isPlayingClass}`} />
            </div>
            )
          : null
      }
        <Col
          title={item.name}
          span={14}
          className={highlightNameClass(songActiveId, item.id)}
      >
          {item.name}
        </Col>
        <Col
          title={artistsArrayTrans(item.artists)}
          span={6}
          className={highlightArtistClass(songActiveId, item.id)}
      >
          {artistsArrayTrans(item.artists)}
        </Col>
        <Col
          span={4}
          className={highlightDurationClass(songActiveId, item.id)}
      >
          {durationTrans(item.time ?? 0)}
        </Col>
      </Row>
      )
    : null
})
FixedRow.displayName = 'FixedRow'

const RightQueue = memo((props: RightQueueProps) => {
  const { clearPlaylists } = useFetchPlaylists()

  const autoplay = useAtomValue(autoplayAtom)

  const queueLoading = useAtomValue(queueLoadingAtom)

  const songLists = useAtomValue(songListsAtom)

  const songActiveIndex = useAtomValue(songActiveIndexAtom)

  const lastSongListsRef = useRef<SongData[]>([])

  // 固定元素高度
  const fixedItemHeight = useRef(36)

  // 固定行渲染列表Ref
  const fixedListRef = useRef<FixedSizeList>(null)

  const handleClearPlaylists = useCallback(() => {
    playerInstance.reset()
    clearPlaylists()
  }, [])

  // 切换显示时，存在播放列表，对当前播放的歌曲位置进行滚动条复位
  useEffect(() => {
    if (
      props.showQueue &&
        songLists.length > 0 &&
        songLists.length > songActiveIndex
    ) {
      const align: Align = songLists.length >= 30 ? 'center' : 'start'
      fixedListRef.current?.scrollToItem(songActiveIndex, align)
    }
  }, [props.showQueue, songLists, songActiveIndex])

  useEffect(() => {
    if (songLists.length > 0 && songLists !== lastSongListsRef.current) {
      lastSongListsRef.current = songLists
      playerInstance.setPlaylist(songLists, songActiveIndex, autoplay)
    }
  }, [songLists, songActiveIndex, autoplay])

  return (
    <>
      <div className="max-h-[100px] px-5 bg-white shadow-xl">
        <h2 className="py-5 text-xl font-semibold">当前播放</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-ctd">总{songLists.length}首</p>
          <Button
            type="link"
            className="py-0 text-sm"
            onClick={handleClearPlaylists}
          >
            清空列表
          </Button>
        </div>
        <Divider className="mt-4 mb-0" />
      </div>
      <div id="container" className="relative flex-1 min-h-[460px] bg-white">
        <LoadingInstance loading={queueLoading} />
        <div className={`mt-40 text-base text-ctd text-center ${!queueLoading && songLists.length === 0 ? '' : 'hidden'}`}>你还没有添加任何歌曲！</div>
        <AutoSizer>
          {({ width, height }: { width: number, height: number }) => (
            <FixedSizeList
              className={!queueLoading && songLists.length > 0 ? '' : 'hidden'}
              ref={fixedListRef}
              width={width}
              height={height}
              itemData={songLists}
              itemCount={songLists.length}
              itemSize={fixedItemHeight.current}
            >
              { FixedRow }
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </>
  )
})

RightQueue.displayName = 'RightQueue'
export default RightQueue
