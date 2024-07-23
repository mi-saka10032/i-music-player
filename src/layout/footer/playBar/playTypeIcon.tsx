import { memo, useCallback, useContext, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { playTypeAtom } from '@/store'
import { PlayType } from '@/core/player'
import GlobalContext from '@/layout/context'

// 播放类型组件
const PlayTypeIcon = memo(() => {
  const playTypeRef = useRef<PlayType[]>([
    PlayType.loop,
    PlayType.single,
    PlayType.random,
    PlayType.sequential
  ])

  const { player } = useContext(GlobalContext)

  const [playType, setPlayType] = useAtom(playTypeAtom)

  const handleSwitchPlayType = useCallback(() => {
    const index = playTypeRef.current.findIndex((item) => item === playType)
    const newType = playTypeRef.current[index + 1] ?? playTypeRef.current[0]
    void setPlayType(newType)
  }, [playType])

  useEffect(() => {
    player.setRepeatMode(playType)
  }, [playType])

  return (
    <div className="flex items-center justify-center">
      <i
        className={`iconfont icon-${playType} text-gc text-xl cursor-pointer`}
        onClick={handleSwitchPlayType}
      />
    </div>
  )
})

PlayTypeIcon.displayName = 'PlayTypeIcon'
export default PlayTypeIcon
