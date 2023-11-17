import { type Dispatch, type SetStateAction, createContext } from 'react'

// 播放队列状态上下文类型
export interface QueueStatus {
  showQueue: boolean
  setShowQueue: Dispatch<SetStateAction<boolean>>
}

export const QueueContext = createContext<QueueStatus>({
  showQueue: false,
  setShowQueue: () => false
})
