import { type PropsWithChildren, memo } from 'react'

type ContainerProps = PropsWithChildren<{
  loading: boolean
  fallback: JSX.Element
}>

const LoadingContainer = memo((props: ContainerProps) => <>{props.loading ? props.fallback : props.children}</>)

LoadingContainer.displayName = 'LoadingContainer'
export default LoadingContainer
