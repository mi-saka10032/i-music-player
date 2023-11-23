import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { ConfigProvider, Tabs, type TabsProps, Row, Col } from 'antd'
import { FixedSizeList } from 'react-window'
import { type LocalPlayQueue, usePlayQueue } from '@/hooks/usePlayQueue'
import { getSongDetail } from '@/api'
import { type SongData } from '@/core/playerType'
import LoadingInstance from '@/components/loadingInstance'
import FavoriteIcon from '@/assets/svg/favorite.svg?react'
import DownloadIcon from '@/assets/svg/download.svg?react'

interface MusicDetailListsProps {
  trackIds: TrackIdsLists
}

// 详情列表支持懒加载
const MusicDetailLists = memo((props: MusicDetailListsProps) => {
  // 详情列表表头
  const ListHeader = memo(() => {
    return (
      <Row
        className="relative w-full h-[36px] px-8 py-[4px] text-neutral-500"
        justify={'space-between'}
        align={'middle'}
        wrap={false}
      >
        <Col span={3}/>
        <Col span={9} className="text-sm">音乐标题</Col>
        <Col span={5} className="text-sm">歌手</Col>
        <Col span={5} className="text-sm">专辑</Col>
        <Col span={2} className="text-sm">时长</Col>
      </Row>
    )
  })
  ListHeader.displayName = 'ListHeader'

  const [loading, setLoading] = useState(false)
  const [playlists, setPlaylists] = useState<SongData[]>([])

  /** 本地转化播放列表数据字段 */
  const localPlayQueue = usePlayQueue(playlists, 0)
  /** 本地转化播放列表数据字段 */

  const batchRef = useRef(200)
  // 固定元素高度
  const fixedItemHeight = useRef(36)
  // 固定列表宽度
  const fixedListWidth = useRef('100%')
  // 固定列表高度
  const [fixedListHeight, setFixedListHeight] = useState(fixedItemHeight.current * batchRef.current)
  // 监听设置列表高度最小值
  useEffect(() => {
    if (localPlayQueue.length > 0 && batchRef.current > localPlayQueue.length) {
      setFixedListHeight(localPlayQueue.length * fixedItemHeight.current)
    }
  }, [localPlayQueue])

  // 固定行渲染元素
  const FixedRow = memo(({ index, style, data }: { index: number, style: React.CSSProperties, data: LocalPlayQueue[] }) => {
    const item = data[index]
    const frontIndex = index + 1
    return item != null
      ? (
        <Row
          key={item.id}
          className={`relative w-full px-8 py-[8px] group ${item.zebraClass}`}
          style={style}
          justify={'space-between'}
          align={'middle'}
          wrap={false}
        >
          <div className="absolute-middle-y left-6 text-sm text-[#cbcbcc] leading-none">{ frontIndex >= 10 ? frontIndex : '0' + frontIndex }</div>
          <Col
            span={3}
            className="flex justify-end items-center pr-5"
          >
            <FavoriteIcon className="w-5 h-5" />
            <DownloadIcon className="ml-2 w-5 h-5" />
          </Col>
          <Col
            title={item.name}
            span={9}
            className={item.songNameClass}
          >
            {item.name}
          </Col>
          <Col
            title={item.artistsName}
            span={5}
            className={item.artistClass}
          >
            {item.artistsName}
          </Col>
          <Col
            span={5}
            className={item.artistClass}
          >
            专辑名称
          </Col>
          <Col
            span={2}
            className={item.durationClass}
          >
            {item.duration}
          </Col>
        </Row>
        )
      : null
  })
  FixedRow.displayName = 'FixedRow'

  // 初始挂载时读取前200首
  useEffect(() => {
    setLoading(true)
    const allIds = props.trackIds.map(item => item.id)
    getSongDetail(allIds)
      .then(res => {
        console.log(res)
        setPlaylists(
          res.map(item => ({
            id: item.id,
            name: item.name,
            artists: item.ar,
            album: item.al,
            time: item.dt
          }))
        )
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.trackIds])

  return (
    <>
      <LoadingInstance loading={loading} />
      <div className={!loading && localPlayQueue.length > 0 ? '' : 'hidden'}>
        <div className="absolute top-0 left-0 w-full pt-[25rem]">
          <ListHeader />
          <FixedSizeList
            className="min-h-0"
            width={fixedListWidth.current}
            height={fixedListHeight}
            itemCount={localPlayQueue.length}
            itemData={localPlayQueue}
            itemSize={fixedItemHeight.current}
          >
            { FixedRow }
          </FixedSizeList>
        </div>
      </div>
    </>
  )
})
MusicDetailLists.displayName = 'MusicDetailLists'

interface MusicDetailListProps {
  trackIds: TrackIdsLists
  onChange?: () => void
}

const MusicDetailTab = memo((props: MusicDetailListProps) => {
  const items = useMemo<TabsProps['items']>(() => [
    {
      key: '1',
      label: '歌曲列表',
      children: null
    },
    {
      key: '2',
      label: '评论',
      children: null
    },
    {
      key: '3',
      label: '收藏者',
      children: null
    }
  ], [props.trackIds])

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemColor: '#434343',
            itemActiveColor: '#434343',
            itemHoverColor: '#434343',
            itemSelectedColor: '#d33a31',
            inkBarColor: '#d33a31'
          }
        }
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarStyle={{ padding: '0 2rem', marginBottom: '0' }}
        onChange={props?.onChange}
      />
      <MusicDetailLists trackIds={props.trackIds} />
    </ConfigProvider>
  )
})

MusicDetailTab.displayName = 'MusicDetailTab'
export default MusicDetailTab
