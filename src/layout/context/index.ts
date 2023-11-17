import { createContext } from 'react'
import player, { type Player } from '@/core/player'

// 播放队列状态上下文类型
export interface CTX {
  player: Player
}

const GlobalContext = createContext<CTX>({
  // 生命周期内仅维持一份player实例
  player
})

export default GlobalContext
