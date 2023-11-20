import { memo, useMemo, useEffect } from 'react'
import { Divider, List, Row, Col, type SpinProps } from 'antd'
import OverlayScrollbarsComponent from '@/components/overlayscrollbars'
import { type SongData } from '@/core/player'
import { durationTrans } from '@/utils/formatter'
import PlaySingleIcon from '@/assets/svg/play_single.svg?react'
import PauseSingleIcon from '@/assets/svg/pause_single.svg?react'

interface RightQueueProps {
  showQueue: boolean
  activeId: number
  activeIndex: number
  playStatus: MediaSessionPlaybackState
  loading: boolean
  playlists: SongData[]
  onLoaded: (isLoading: boolean) => void
  onIndexChange: (index: number) => void
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
  // 列表左侧播放/暂停小图标展示
  const CoreIcon = useMemo(() => {
    return props.playStatus === 'paused' ? <PauseSingleIcon className="w-3.5 h-3.5" /> : <PlaySingleIcon className="w-3 h-3" />
  }, [props.playStatus])

  // loading实例
  const loadingInstance = useMemo((): SpinProps | boolean => {
    if (props.loading) {
      return {
        spinning: true,
        wrapperClassName: 'h-full'
      }
    } else return false
  }, [props.loading])

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
      zebraClass: index % 2 !== 0 ? 'bg-[#fdfdfd] hover:bg-[#f3f3f3]' : ' bg-[#f6f6f6] hover:bg-[#f2f2f2] ',
      songNameClass: highlightIdClass(item.id, 'text-black '),
      artistClass: highlightIdClass(item.id, 'text-neutral-500 '),
      durationClass: highlightIdClass(item.id, 'text-teal-400 ')
    }))
  }, [props.playlists, props.activeId])

  // 播放列表依赖更新完毕后，关闭loading
  useEffect(() => {
    if (props.playlists.length > 0) {
      props.onLoaded(false)
    }
  }, [props.playlists])

  // 切换显示时，存在播放列表，对当前播放的歌曲位置进行滚动条复位
  useEffect(() => {
    if (props.showQueue) {
      const items = document.querySelectorAll('.playlist-item')
      if (items.length - 1 > props.activeIndex) {
        items[props.activeIndex].scrollIntoView({ block: 'center' })
      }
    }
  }, [props.showQueue, props.activeIndex])

  return (
    <>
      <div className="h-[50px]"></div>
      <div className="bg-white shadow-xl">
        <div className="px-5">
          <h2 className="py-5 text-xl font-semibold">当前播放</h2>
          <div className="flex items-center">
            <p className="text-sm text-ctd">总{localPlayQueue.length}首</p>
          </div>
          <Divider className="mt-4 mb-0" />
        </div>
      </div>
      <div className="flex-1 flex bg-white overflow-hidden">
        <OverlayScrollbarsComponent>
          <List
            className="h-auto"
            size="small"
            split={false}
            loading={loadingInstance}
            dataSource={localPlayQueue}
            locale={{
              emptyText: <p className="mt-24">你还没有添加任何歌曲！</p>
            }}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                className={`relative playlist-item group ${item.zebraClass}`}
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
              </List.Item>
            )}
          />
        </OverlayScrollbarsComponent>
      </div>
      <div className="h-[60px]"></div>
    </>
  )
})

RightQueue.displayName = 'RightQueue'
export default RightQueue
