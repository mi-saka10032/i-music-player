import { memo } from 'react'
import CollectIcon from '@/assets/svg/collect.svg?react'
import { playCountTrans } from '@/utils/formatter'

interface CollectButtonProps {
  subscribedCount: number
  onCollect?: () => void
}

export const CollectButton = memo((props: CollectButtonProps) => {
  return (
    <button
      className="flex items-center px-4 h-10 rounded-[1.25rem] text-[#3d3d3d] border border-[#d9d9d9] bg-white hover:bg-[#f2f2f2]"
      onClick={props?.onCollect}
    >
      <CollectIcon className="w-5 h-5 fill-[#3d3d3d]" />
      <span className="ml-1">收藏({playCountTrans(props.subscribedCount)})</span>
    </button>
  )
})

CollectButton.displayName = 'CollectButton'
