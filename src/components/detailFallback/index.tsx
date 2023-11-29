import { memo, type CSSProperties } from 'react'
import { Skeleton } from 'antd'

const detailCoverStyle: CSSProperties = {
  marginRight: '2rem',
  width: '14rem',
  height: '14rem',
  borderRadius: '0.5rem'
}

const detailNameStyle: CSSProperties = {
  width: '24rem'
}

const DetailFallback = memo(() => (
  <div className="pl-8 flex">
    <Skeleton.Image active={true} style={detailCoverStyle} />
    <div className="flex flex-col space-y-2">
      <Skeleton.Input active={true} size="default" style={detailNameStyle} />
      <Skeleton.Input active={true} size="small" style={{ width: '16rem' }} />
      <div className="flex items-center space-x-2">
        <Skeleton.Button active={true} size="default" style={{ width: '10rem' }} />
        <Skeleton.Button active={true} size="default" style={{ width: '6rem' }} />
        <Skeleton.Button active={true} size="default" style={{ width: '6rem' }} />
        <Skeleton.Button active={true} size="default" style={{ width: '6rem' }} />
      </div>
      <Skeleton.Input active={true} size="small" style={{ width: '12rem' }} />
      <Skeleton.Input active={true} size="small" style={{ width: '12rem' }} />
      <Skeleton.Input active={true} size="small" style={{ width: '32rem' }} />
    </div>
  </div>
))

DetailFallback.displayName = 'DetailFallback'
export {
  detailCoverStyle,
  detailNameStyle,
  DetailFallback
}
