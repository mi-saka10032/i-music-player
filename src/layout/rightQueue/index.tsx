import { forwardRef, memo, useMemo, useCallback, useEffect } from 'react'
import { Divider, List, Row, Col, type SpinProps } from 'antd'
import OverlayScrollbarsComponent from '@/components/overlayscrollbars'
import { type SongData } from '@/core/player'
import { durationTrans } from '@/utils/formatter'
import PlaySingleIcon from '@/assets/svg/play_single.svg?react'
import PauseSingleIcon from '@/assets/svg/pause_single.svg?react'

interface RightQueueProps {
  className: string
  activeId: number
  playStatus: MediaSessionPlaybackState
  loading: boolean
  playlists: SongData[]
  onLoaded: (isLoading: boolean) => void
  onIndexChange: (index: number) => void
}

const RightQueue: React.ForwardRefExoticComponent<RightQueueProps & React.RefAttributes<HTMLDivElement>> = memo(
  forwardRef(
    (props, ref) => {
      const CoreIcon = useMemo(() => {
        return props.playStatus === 'paused' ? <PauseSingleIcon className="w-3.5 h-3.5" /> : <PlaySingleIcon className="w-3 h-3" />
      }, [props.playStatus])

      const artistNames = useCallback((artists: AR[]): string => {
        return artists.map(item => item.name).join('/')
      }, [])

      const loadingInstance = useMemo((): SpinProps | boolean => {
        if (props.loading) {
          return {
            spinning: true,
            wrapperClassName: 'h-full'
          }
        } else return false
      }, [props.loading])

      // 字体特殊高亮类名
      const highlightIdClass = useCallback((itemId: number, defaultColor: string): string => {
        return 'text-ellipsis text-sm ' + (itemId === props.activeId ? 'text-red-500 ' : defaultColor + 'group-hover:text-black ')
      }, [props.activeId])

      // 播放列表依赖更新完毕后，关闭loading
      useEffect(() => {
        if (props.playlists.length > 0) {
          props.onLoaded(false)
        }
      }, [props.playlists])

      useEffect(() => {
        console.log('right queue update')
      })

      return (
        <div ref={ref} className={`fixed top-0 right-[-30rem] z-10 transition-all duration-500 flex flex-col w-[30rem] h-full ${props.className}`}>
          <div className="h-[50px]"></div>
          <div className="bg-white shadow-xl">
            <div className="px-5">
              <h2 className="py-5 text-xl font-semibold">当前播放</h2>
              <div className="flex items-center">
                <p className="text-sm text-ctd">总{props.playlists.length}首</p>
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
                dataSource={props.playlists}
                locale={{
                  emptyText: <p className="mt-24">你还没有添加任何歌曲！</p>
                }}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                    className={`relative group ${index % 2 !== 0 ? 'bg-[#fdfdfd] hover:bg-[#f3f3f3]' : ' bg-[#f6f6f6] hover:bg-[#f2f2f2] '}`}
                    onDoubleClick={() => { props.onIndexChange(index) }}
                  >
                    <div className={`${item.id === props.activeId ? 'block' : 'hidden'} absolute left-0.5 top-1/2 -translate-y-[50%]`}>
                      { CoreIcon }
                    </div>
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
                        className={highlightIdClass(item.id, 'text-black ')}
                      >
                        {item.name}
                      </Col>
                      <Col
                        title={artistNames(item.artists)}
                        span={6}
                        className={highlightIdClass(item.id, 'text-neutral-500 ')}
                      >
                        {artistNames(item.artists)}
                      </Col>
                      <Col
                        span={4}
                        className={`${highlightIdClass(item.id, 'text-teal-400 ')} text-teal-400 group-hover:text-black`}
                      >
                        {durationTrans(item.time ?? 0)}
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </OverlayScrollbarsComponent>
          </div>
          <div className="h-[60px]"></div>
        </div>
      )
    }
  )
)

RightQueue.displayName = 'RightQueue'
export default RightQueue
