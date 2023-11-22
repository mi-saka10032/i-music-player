import { memo } from 'react'

const Mine = memo(() => {
  return <h1>我喜欢的音乐</h1>
})

Mine.displayName = 'Mine'
export const Component = Mine
export default Mine
