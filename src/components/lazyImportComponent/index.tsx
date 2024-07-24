import { type MemoExoticComponent, type LazyExoticComponent, memo, Suspense } from 'react'
import ErrorBoundary from '@/components/errorBoundary'
import LoadingInstance from '@/components/loadingInstance'

// 懒加载容器
export const LazyImportComponent = memo((props: {
  lazyChildren: LazyExoticComponent<MemoExoticComponent<() => JSX.Element>>
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingInstance />}>
        <props.lazyChildren />
      </Suspense>
    </ErrorBoundary>
  )
})

LazyImportComponent.displayName = 'LazyImportComponent'
export default LazyImportComponent
