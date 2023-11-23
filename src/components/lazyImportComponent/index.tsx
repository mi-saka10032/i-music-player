import React from 'react'
import ErrorBoundary from '../errorBoundary'
import LoadingInstance from '../loadingInstance'

// 懒加载容器
export const LazyImportComponent = React.memo((props: {
  lazyChildren: React.LazyExoticComponent<React.MemoExoticComponent<() => JSX.Element>>
}) => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingInstance loading={true} />}>
        <props.lazyChildren />
      </React.Suspense>
    </ErrorBoundary>
  )
})

LazyImportComponent.displayName = 'LazyImportComponent'
export default LazyImportComponent
