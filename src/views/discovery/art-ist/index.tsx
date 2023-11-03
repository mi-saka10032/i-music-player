import { memo } from 'react'

const ArtList = memo(() => {
  return (
    <h1>歌手</h1>
  )
})

ArtList.displayName = 'ArtList'
export const Component = ArtList
export default ArtList
