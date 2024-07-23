import { createContext } from 'react'
import { type Player, playerInstance } from '@/core/player'

// 播放队列状态上下文类型
export interface CTX {
  player: Player
}

const GlobalContext = createContext<CTX>({
  player: playerInstance
})

export default GlobalContext
