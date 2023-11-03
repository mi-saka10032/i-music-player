import { memo } from 'react'

const My = memo(() => {
  return <h1>我喜欢的音乐</h1>
})

My.displayName = 'My'
export const Component = My
export default My
