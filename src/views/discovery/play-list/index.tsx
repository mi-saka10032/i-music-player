import { memo } from 'react'

const PlayList = memo(() => {
  return <h1>歌单</h1>
})

PlayList.displayName = 'PlayList'
export const Component = PlayList
export default PlayList
