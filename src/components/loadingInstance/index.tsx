import { memo } from 'react'
import LoadingIcon from '@/assets/svg/loading.svg?react'

const LoadingInstance = memo(() => {
  return (
    <div className="absolute-middle-full flex items-center">
      <LoadingIcon className="animate-spin w-8 h-8" />
      <span className="ml-5 text-base text-gray-500">载入中...</span>
    </div>
  )
})

LoadingInstance.displayName = 'LoadingInstance'
export default LoadingInstance
