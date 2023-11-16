import { memo, useRef, useCallback, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { setPlayType } from '@/store/playlist'
import player, { PlayType } from '@/core/player'
import LinkedList from '@/utils/linkedList'

const playTypeList: PlayType[] = [
  PlayType.loop,
  PlayType.single,
  PlayType.random,
  PlayType.sequential
]
const linkedList = new LinkedList(playTypeList)

// 播放类型组件
const PlayTypeIcon = memo(() => {
  const { playerType } = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()

  // 播放类型链表
  const chain = useRef(linkedList.head)
  const changePlayType = useCallback(() => {
    const node = chain.current?.next
    // 链表对象next下一位
    chain.current = node!
    const type = node?.value as PlayType
    // 派发播放类型
    dispatch(setPlayType(type))
  }, [])

  // 生命周期内仅维持一份player实例
  const playerRef = useRef(player)

  // 设置播放类型副作用
  useEffect(() => {
    playerRef.current.setRepeatMode(playerType.type)
  }, [playerType.type])

  return (
    <div className="flex items-center justify-center">
      <i
        className={`iconfont icon-${playerType.type} text-ct text-base cursor-pointer`}
        onClick={changePlayType}
      />
    </div>
  )
})

PlayTypeIcon.displayName = 'PlayTypeIcon'
export default PlayTypeIcon
