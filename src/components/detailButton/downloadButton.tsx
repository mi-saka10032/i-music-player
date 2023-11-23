import { memo } from 'react'
import DownloadIcon from '@/assets/svg/download.svg?react'

interface CollectButtonProps {
  onDownload?: () => void
}

export const DownloadButton = memo((props: CollectButtonProps) => {
  return (
    <button
      className="flex items-center px-4 h-10 rounded-[1.25rem] text-[#3d3d3d] border border-[#d9d9d9] bg-white hover:bg-[#f2f2f2]"
      onClick={props?.onDownload}
    >
      <DownloadIcon className="w-5 h-5 fill-[#3d3d3d]" />
      <span className="ml-1">下载全部</span>
    </button>
  )
})

DownloadButton.displayName = 'DownloadButton'
