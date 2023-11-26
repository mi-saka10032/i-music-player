import { type CSSProperties, memo, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/hooks'
import { getSongDetail } from '@/api'
import { type SongData } from '@/core/playerType'
import AutoSizer from 'react-virtualized-auto-sizer'
import VirtualList from '@/components/virtualList'
import LoadingInstance from '@/components/loadingInstance'
import { generateZebraClass, serializeNumberTrans, artistsArrayTrans, durationTrans, customSongDataTrans } from '@/utils/formatter'
import { highlightNameClass, highlightArtistClass, highlightDurationClass } from '@/utils/highlightSongClass'
import { CONTENT_CONTAINER_ID } from '@/utils/constant'
import PlayInActiveIcon from '@/assets/svg/play_inactive.svg?react'
import PlayActiveIcon from '@/assets/svg/play_active.svg?react'
import FavoriteIcon from '@/assets/svg/favorite.svg?react'
import DownloadIcon from '@/assets/svg/download.svg?react'
import { getJaySongs } from '@/api/jay'

interface MusicDetailListsProps {
  isCustom: boolean
  listsIds: number[]
  checkById: (id: number) => void
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
  const { activeId } = useAppSelector(state => state.playlist)
  // 全局播放状态 以动态切换小图标
  const { status } = useAppSelector(state => state.playerStatus)

  const [loading, setLoading] = useState(false)
  const [playlists, setPlaylists] = useState<SongData[]>([])

  useEffect(() => {
    if (props.isCustom) {
      // 自定义歌曲调用其他接口
      setLoading(true)
      getJaySongs()
        .then(res => {
          setPlaylists(customSongDataTrans(res.list))
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      // 初始挂载时读取前200首
      if (props.listsIds.length > 0) {
        setLoading(true)
        getSongDetail(props.listsIds)
          .then(res => {
            setPlaylists(res.map(item => ({
              id: item.id,
              name: item.name,
              artists: item.ar,
              album: item.al,
              time: item.dt
            })))
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [props.isCustom, props.listsIds])

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
        className={`relative flex items-center w-full h-[36px] px-8 py-[8px] group ${generateZebraClass(index)}`}
        style={style}
        onDoubleClick={() => { props.checkById(item.id) }}
      >
        <span className="w-[7.5rem] flex justify-between items-center pr-5">
          {
            item.id === activeId
              ? (
                  status === 'playing'
                    ? <PlayActiveIcon className="w-4 h-4" />
                    : <PlayInActiveIcon className="w-5 h-5" />
                )
              : (
                <span className="text-sm text-[#cbcbcc] leading-none">
                  {serializeNumberTrans(index)}
                </span>
                )
          }
          <span className="flex items-center">
            <FavoriteIcon className="w-5 h-5" />
            <DownloadIcon className="ml-2 w-5 h-5" />
          </span>
        </span>
        <span
          title={item.name}
          className={`flex-1 ${highlightNameClass(activeId, item.id)}`}
        >
          {item.name}
        </span>
        <span
          title={artistsArrayTrans(item.artists)}
          className={`w-2/12 ${highlightArtistClass(activeId, item.id)}`}
        >
          {artistsArrayTrans(item.artists)}
        </span>
        <span className={`w-3/12 ${highlightArtistClass(activeId, item.id)}`}>
          {item.album.name}
        </span>
        <span className={`w-1/12 ${highlightDurationClass(activeId, item.id)}`}>
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
        <LoadingInstance loading={loading} />
        <AutoSizer>
          {({ width, height }: { width: number, height: number }) => (
            <VirtualList
              className={`${!loading && playlists.length > 0 ? '' : 'hidden'}`}
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
      </ul>
    </>
  )
})

MusicDetailLists.displayName = 'MusicDetailLists'
export default MusicDetailLists
