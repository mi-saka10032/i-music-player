import { invoke } from '@tauri-apps/api/tauri'
import { listen, type UnlistenFn } from '@tauri-apps/api/event'
import { memo, useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { playTypeAtom } from '@/store'
import { PlayType, playerInstance } from '@/core'
import classNames from 'classnames'
import { SWITCH_REPEAT_MODE } from '@/common/constants'

// 播放类型组件
const PlayTypeIcon = memo(() => {
  const systemTrayPlayType = useRef<PlayType | null>(null)

  const listenChangeTrayFn = useRef<UnlistenFn | null>(null)

  const playTypeRef = useRef<PlayType[]>([
    PlayType.loop,
    PlayType.single,
    PlayType.shuffle,
    PlayType.sequential
  ])

  const [playType, setPlayType] = useAtom(playTypeAtom)

  const handleSwitchPlayType = useCallback(() => {
    const index = playTypeRef.current.findIndex((item) => item === playType)
    const newType = playTypeRef.current[index + 1] ?? playTypeRef.current[0]
    setPlayType(newType)
  }, [playType])

  useEffect(() => {
    playerInstance.setRepeatMode(playType)
    if (systemTrayPlayType.current !== playType) {
      systemTrayPlayType.current = playType
      void invoke('change_tray', { repeatMode: playType })
    }
  }, [playType])

  const mountSystemTrayEvent = useCallback(async () => {
    listenChangeTrayFn.current = await listen<PlayType>(SWITCH_REPEAT_MODE, ({ payload }) => {
      systemTrayPlayType.current = payload
      setPlayType(payload)
    })
  }, [])

  const unmountSystemTrayEvent = useCallback(() => {
    listenChangeTrayFn.current != null && listenChangeTrayFn.current()
  }, [])

  useEffect(() => {
    void mountSystemTrayEvent()
    return () => {
      unmountSystemTrayEvent()
    }
  }, [])

  return (
    <div className="flex items-center justify-center">
      <i
        className={classNames('iconfont text-gc text-xl cursor-pointer', `icon-${playType}`)}
        onClick={handleSwitchPlayType}
      />
    </div>
  )
})

PlayTypeIcon.displayName = 'PlayTypeIcon'
export default PlayTypeIcon
