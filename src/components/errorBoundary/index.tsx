import React from 'react'
import NetworkErrorIcon from '@/assets/svg/network_error.svg?react'

type ErrorBoundaryProps = React.PropsWithChildren

interface ErrorBoundaryState {
  hasError: boolean
};

// 错误兜底
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
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

  public componentDidCatch (error: Error, errorInfo: React.ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.group()
    console.log('ErrorBoundary catch a error:')
    console.info('error', error)
    console.info('error info', errorInfo)
    console.groupEnd()
  }

  public refresh () {
    window.location.replace('/')
  }

  render () {
    if (this.state.hasError) {
      console.log('Component ErrorBoundary render...')
      return (
        <div className="absolute-middle-full flex items-center space-x-5">
          <NetworkErrorIcon className="w-8 h-8" />
          <span className="text-base text-gray-500">网络接口异常，请重试</span>
          <span className="text-red-600 cursor-pointer" onClick={this.refresh}>回到首页</span>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
