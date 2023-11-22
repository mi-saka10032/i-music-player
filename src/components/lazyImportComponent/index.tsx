import React from 'react'
import LoadingIcon from '@/assets/svg/loading.svg?react'

const GlobalLoading = React.memo(() => {
  return (
    <div className="absolute-middle-full flex items-center">
      <LoadingIcon className="animate-spin w-8 h-8" />
      <span className="ml-5 text-base text-gray-500">载入中...</span>
    </div>
  )
})
GlobalLoading.displayName = 'GlobalLoading'

export const LazyImportComponent = React.memo((props: {
  lazyChildren: React.LazyExoticComponent<React.MemoExoticComponent<() => JSX.Element>>
}) => {
  return (
    <React.Suspense fallback={<GlobalLoading />}>
      <props.lazyChildren />
    </React.Suspense>
  )
})

LazyImportComponent.displayName = 'LazyImportComponent'
export default LazyImportComponent
