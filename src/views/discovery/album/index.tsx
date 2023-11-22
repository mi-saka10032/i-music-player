import { memo } from 'react'

const Album = memo(() => {
  return <h1>最新音乐</h1>
})

Album.displayName = 'Album'
export default Album
