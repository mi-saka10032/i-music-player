import { memo } from 'react'

interface CollectButtonProps {
  onDownload?: () => void
}

export const DownloadButton = memo((props: CollectButtonProps) => {
  return (
    <button
      className="flex items-center px-4 h-10 rounded-[1.25rem] text-[#3d3d3d] border border-[#d9d9d9] bg-white hover:bg-[#f2f2f2]"
      onClick={props?.onDownload}
    >
      <i className="iconfont icon-download text-base leading-none" />
      <span className="ml-1 text-sm leading-none">下载全部</span>
    </button>
  )
})

DownloadButton.displayName = 'DownloadButton'
