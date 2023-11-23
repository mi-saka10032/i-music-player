import { memo, useMemo, useState } from 'react'
import PlayWhiteIcon from '@/assets/svg/play_white.svg?react'
import PlusWhiteIcon from '@/assets/svg/plus_white.svg?react'

interface PlayAllButtonProps {
  onPlayAll?: () => void
  onCollect?: () => void
}

export const PlayAllButton = memo((props: PlayAllButtonProps) => {
  // 播放按钮三色切换 拥有三种红色 2-深色 1-浅色 0-最浅
  const [playEnter, setPlayInter] = useState(false)
  const [collectEnter, setCollectEnter] = useState(false)
  const switchTripleBG = useMemo<[string, string]>(() => {
    if (playEnter) return ['bg-[#cd3232]', 'bg-[#d83535]']
    if (collectEnter) return ['bg-[#d83535]', 'bg-[#cd3232]']
    return ['', '']
  }, [playEnter, collectEnter])

  return (
    <button className="relative flex items-center h-10 rounded-[1.25rem] text-white bg-[#ec4141]">
      <nav
        className={`pl-4 pr-2.5 flex items-center h-full rounded-l-[1.25rem] ${switchTripleBG[0]}`}
        onMouseEnter={() => { setPlayInter(true) }}
        onMouseLeave={() => { setPlayInter(false) }}
        onClick={props?.onPlayAll}
      >
        <PlayWhiteIcon className="w-6 h-6" />
        <span className="ml-1">播放全部</span>
      </nav>
      <span className="absolute top-0 right-11 w-[1px] h-full bg-[#ee5454]"></span>
      <nav
        className={`pr-4 pl-2.5 flex items-center h-full rounded-r-[1.25rem] ${switchTripleBG[1]}`}
        onMouseEnter={() => { setCollectEnter(true) }}
        onMouseLeave={() => { setCollectEnter(false) }}
        onClick={props?.onCollect}
      >
        <PlusWhiteIcon className="w-5 h-5" />
      </nav>
    </button>
  )
})

PlayAllButton.displayName = 'PlayAllButton'