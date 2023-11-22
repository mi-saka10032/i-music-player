import { memo, type CSSProperties } from 'react'
import { Skeleton } from 'antd'

const detailCoverStyle: CSSProperties = {
  marginRight: '2rem',
  width: '14rem',
  height: '14rem',
  borderRadius: '0.5rem'
}

const DetailFallback = memo(() => (
  <Skeleton.Image active={true} style={detailCoverStyle} />
))

DetailFallback.displayName = 'DetailFallback'
export {
  detailCoverStyle,
  DetailFallback
}
