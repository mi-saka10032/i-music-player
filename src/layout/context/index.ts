import { type Dispatch, type SetStateAction, createContext } from 'react'
import player, { type Player } from '@/core/player'

// 播放队列状态上下文类型
export interface QueueStatus {
  showQueue: boolean
  setShowQueue: Dispatch<SetStateAction<boolean>>
  player: Player
}

const GlobalContext = createContext<QueueStatus>({
  showQueue: false,
  setShowQueue: () => false,
  // 生命周期内仅维持一份player实例
  player
})

export default GlobalContext
