import { memo, useMemo } from 'react'
import { ConfigProvider, Tabs, type TabsProps } from 'antd'
import MusicDetailLists from './lists'

interface MusicDetailTabProps {
  isCustom: boolean
  listsIds: number[]
  handlePlayWithExactId: (id: number) => void
}

/** MusicDetail位于中部的Tab菜单组件，暂无特殊作用，只为接收MusicLists组件 */
const MusicDetailTab = memo((props: MusicDetailTabProps) => {
  const items = useMemo<TabsProps['items']>(() => [
    {
      key: '1',
      label: '歌曲列表',
      children: (
        <MusicDetailLists
          isCustom={props.isCustom}
          listsIds={props.listsIds}
          handlePlayWithExactId={props.handlePlayWithExactId}
        />
      )
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
  ], [props.isCustom, props.listsIds, props.handlePlayWithExactId])

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
        destroyInactiveTabPane={true}
      />
    </ConfigProvider>
  )
})

MusicDetailTab.displayName = 'MusicDetailTab'
export default MusicDetailTab
