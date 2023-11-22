import React from 'react'
import LoadingIcon from '@/assets/svg/loading.svg?react'
import NetworkErrorIcon from '@/assets/svg/network_error.svg?react'

interface ErrorBoundaryState {
  hasError: boolean
};

// 错误兜底
class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor (props: React.PropsWithChildren) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError (error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    console.log(error)
    return { hasError: true }
  }

  componentDidCatch (error: Error, errorInfo: React.ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.group()
    console.log('ErrorBoundary catch a error:')
    console.info('error', error)
    console.info('error info', errorInfo)
    console.groupEnd()
  }

  render () {
    if (this.state.hasError) {
      console.log('Component ErrorBoundary render...')
      return (
        <div className="absolute-middle-full flex items-center">
          <NetworkErrorIcon className="w-8 h-8" />
          <span className="ml-5 text-base text-gray-500">网络接口异常，请重试</span>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

// 全局加载
const GlobalLoading = React.memo(() => {
  return (
    <div className="absolute-middle-full flex items-center">
      <LoadingIcon className="animate-spin w-8 h-8" />
      <span className="ml-5 text-base text-gray-500">载入中...</span>
    </div>
  )
})
GlobalLoading.displayName = 'GlobalLoading'

// 懒加载容器
export const LazyImportComponent = React.memo((props: {
  lazyChildren: React.LazyExoticComponent<React.MemoExoticComponent<() => JSX.Element>>
}) => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<GlobalLoading />}>
        <props.lazyChildren />
      </React.Suspense>
    </ErrorBoundary>
  )
})

LazyImportComponent.displayName = 'LazyImportComponent'
export default LazyImportComponent
