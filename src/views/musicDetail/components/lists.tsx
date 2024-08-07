import { type CSSProperties, memo, useEffect, useRef, useState, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { playerStatusAtom, songActiveIdAtom } from '@/store'
import { getSongDetail, getJaySongs } from '@/api'
import AutoSizer from 'react-virtualized-auto-sizer'
import VirtualList from '@/components/virtualList'
import LoadingContainer from '@/components/loadingContainer'
import LoadingInstance from '@/components/loadingInstance'
import {
  CONTENT_CONTAINER_ID,
  generateZebraClass,
  serializeNumberTrans,
  artistsArrayTrans,
  durationTrans,
  customSongDataTrans,
  highlightNameClass,
  highlightArtistClass,
  highlightDurationClass,
  normalSongDataTrans
} from '@/utils'
import { useAsyncFn } from '@/hooks'
import classNames from 'classnames'

interface MusicDetailListsProps {
  isCustom: boolean
  listsIds: number[]
  handlePlayWithExactId: (id: number) => void
}

/** MusicDetail位于底部的列表List组件，监听外部容器scroll，手动实现虚拟滚动 */
const MusicDetailLists = memo((props: MusicDetailListsProps) => {
  // 详情列表表头
  const ListHeader = memo(() => {
    return (
      <div className="relative flex items-center w-full h-[36px] px-8 py-[4px] text-neutral-500">
        <span className="w-[7.5rem]"/>
        <span className="flex-1 text-sm">音乐标题</span>
        <span className="w-2/12 text-sm">歌手</span>
        <span className="w-3/12 text-sm">专辑</span>
        <span className="w-1/12 text-sm">时长</span>
      </div>
    )
  })
  ListHeader.displayName = 'ListHeader'

  // 全局activeId
  const songActiveId = useAtomValue(songActiveIdAtom)
  // 全局播放状态 以动态切换小图标
  const playerStatus = useAtomValue(playerStatusAtom)

  const handleSwitchSong = useCallback((songId: number) => {
    props.handlePlayWithExactId(songId)
  }, [props.handlePlayWithExactId])

  const initPlaylists = useCallback(async (): Promise<SongData[]> => {
    if (props.isCustom) {
      const res = await getJaySongs()
      return customSongDataTrans(res.list)
    } else if (props.listsIds.length > 0) {
      const res = await getSongDetail(props.listsIds)
      return normalSongDataTrans(res)
    }
    return []
  }, [props.isCustom, props.listsIds])

  const { data: playlists, loading } = useAsyncFn(initPlaylists, [])

  // list动态高度设置
  const listRef = useRef<HTMLUListElement>(null)
  const [containerHeight, setContainerHeight] = useState('20rem')
  // 固定元素高度
  const fixedItemHeight = useRef(36)
  // 跟随外部元素滚动高度
  const [scrollPosition, setScrollPosition] = useState(0)

  // playlists变化时动态设置ul最小视口高度
  useEffect(() => {
    if (playlists.length > 0) {
      const ul = listRef.current as HTMLUListElement
      const top = ul.getBoundingClientRect().top
      const bottom = 60
      setContainerHeight(`calc(100vh - ${top + bottom}px)`)
    }
  }, [playlists])

  // 监听滚动条触底切割playlistsRef
  useEffect(() => {
    const content = document.getElementById(CONTENT_CONTAINER_ID)!
    const handleScroll = () => {
      setScrollPosition(content.scrollTop)
    }
    content.addEventListener('scroll', handleScroll)
    return () => {
      content.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 固定行渲染元素
  const FixedRow = memo(({ index, style, data }: { index: number, style: CSSProperties, data: SongData[] }) => {
    if (data.length === 0) {
      return null
    }
    const item = data[index]
    return (
      <li
        key={item.id + index}
        className={classNames('relative flex items-center w-full h-[36px] px-8 py-[8px] group', generateZebraClass(index))}
        style={style}
        onDoubleClick={() => { handleSwitchSong(item.id) }}
      >
        <span className="w-[7.5rem] flex justify-between items-center pr-5">
          {
            item.id === songActiveId
              ? <i className={classNames('iconfont text-xl text-primary', playerStatus === 'playing' ? 'icon-play-active' : 'icon-play-inactive')} />
              : (
                <span className="text-sm text-[#cbcbcc] leading-none">
                  {serializeNumberTrans(index)}
                </span>
                )
          }
          <span className="flex items-center text-ctd">
            <i className="iconfont icon-like mr-2" />
            <i className="iconfont icon-download" />
          </span>
        </span>
        <span
          title={item.name}
          className={classNames('flex-1', highlightNameClass(songActiveId, item.id))}
        >
          {item.name}
        </span>
        <span
          title={artistsArrayTrans(item.artists)}
          className={classNames('w-2/12', highlightArtistClass(songActiveId, item.id))}
        >
          {artistsArrayTrans(item.artists)}
        </span>
        <span className={classNames('w-3/12', highlightArtistClass(songActiveId, item.id))}>
          {item.album.name}
        </span>
        <span className={classNames('w-1/12', highlightDurationClass(songActiveId, item.id))}>
          {durationTrans(item.time ?? 0)}
        </span>
      </li>
    )
  })
  FixedRow.displayName = 'FixedRow'

  return (
    <>
      <ListHeader />
      <ul ref={listRef} className="relative" style={{ minHeight: containerHeight }}>
        <LoadingContainer loading={loading} fallback={<LoadingInstance />}>
          <AutoSizer>
            {({ width, height }: { width: number, height: number }) => (
              <VirtualList
                className={classNames({ hidden: playlists.length === 0 })}
                width={width}
                height={height}
                itemData={playlists}
                itemCount={playlists.length}
                itemSize={fixedItemHeight.current}
                scrollPosition={scrollPosition}
              >
                { FixedRow }
              </VirtualList>
            )}
          </AutoSizer>
        </LoadingContainer>
      </ul>
    </>
  )
})

MusicDetailLists.displayName = 'MusicDetailLists'
export default MusicDetailLists
