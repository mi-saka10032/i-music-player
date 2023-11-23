import { memo, useMemo } from 'react'
import { ConfigProvider, Tabs, type TabsProps } from 'antd'
import MusicDetailLists from './detailLists'

interface MusicDetailTabProps {
  trackIds: TrackIdsLists
  onChange?: () => void
}

const MusicDetailTab = memo((props: MusicDetailTabProps) => {
  const items = useMemo<TabsProps['items']>(() => [
    {
      key: '1',
      label: '歌曲列表',
      children: <MusicDetailLists trackIds={props.trackIds} />
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
    </ConfigProvider>
  )
})

MusicDetailTab.displayName = 'MusicDetailTab'
export default MusicDetailTab
