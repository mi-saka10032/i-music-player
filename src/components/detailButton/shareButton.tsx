import { memo } from 'react'
import ShareIcon from '@/assets/svg/share.svg?react'
import { playCountTrans } from '@/utils/formatter'

interface CollectButtonProps {
  shareCount: number
  onCollect?: () => void
}

export const ShareButton = memo((props: CollectButtonProps) => {
  return (
    <button
      className="flex items-center px-4 h-10 rounded-[1.25rem] text-[#3d3d3d] border border-[#d9d9d9] bg-white hover:bg-[#f2f2f2]"
      onClick={props?.onCollect}
    >
      <ShareIcon className="w-5 h-5 fill-[#3d3d3d]" />
      <span className="ml-1">分享({playCountTrans(props.shareCount)})</span>
    </button>
  )
})

ShareButton.displayName = 'ShareButton'
