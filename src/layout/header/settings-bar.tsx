import { memo, type ButtonHTMLAttributes, useCallback, useState, useEffect } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { message } from 'antd'
import classNames from 'classnames'

interface ButtonAttr extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string
  active?: boolean
}

const IconBtn = memo(({ icon, title, active, disabled, onClick }: ButtonAttr) => {
  return (
    <button
      className={
        classNames(
          'flex items-center justify-center iconfont w-7 h-7 text-xl rounded-full  enabled:hover:bg-[#e9e9e9] disabled:opacity-10',
        `icon-${icon}`,
        active === true ? 'text-primary' : 'text-ctd'
        )}
      onClick={onClick}
      disabled={disabled}
      title={title}
    ></button>
  )
})

IconBtn.displayName = 'IconBtn'

const SettingsBar = memo(() => {
  const [messageApi, contextHolder] = message.useMessage()
  const [maxState, setMaxState] = useState(false)

  const abilityToDo = useCallback(() => {
    void messageApi.open({
      type: 'warning',
      content: '功能制作中',
      duration: 1
    })
  }, [])

  const watchWindowState = useCallback(async () => {
    const isMax = await appWindow.isMaximized()
    setMaxState(isMax)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', watchWindowState)
    return () => {
      window.removeEventListener('resize', watchWindowState)
    }
  }, [])

  return (
    <ul className="flex space-x-4 text-ctd">
      <li>
        <div className="relative">
          <i className="absolute left-2 top-2/4 pt-0.5 -translate-y-1/2 iconfont icon-search text-base"></i>
          <input
            type="search"
            className="w-44 h-7 leading-7 py-1 pl-7 pr-2 text-sm outline-none border-0 rounded-full bg-[#e9e9e9]"
            placeholder="搜索"
          />
        </div>
      </li>
      <li onClick={abilityToDo}>
        <IconBtn icon="setting" />
      </li>
      <li onClick={abilityToDo}>
        <IconBtn icon="mail" />
      </li>
      <li onClick={abilityToDo}>
        <IconBtn icon="theme" />
      </li>
      <button className="hover:text-primary" onClick={() => { void appWindow.minimize() }}>
        <i className="iconfont icon-min text-xl" title="最小化" />
      </button>
      <button className="hover:text-primary" onClick={() => { void appWindow.toggleMaximize() }}>
        {
          maxState
            ? <i className="iconfont icon-minimize text-xl" title="还原" />
            : <i className="iconfont icon-max text-xl" title="最大化" />
        }
      </button>
      <button className="hover:text-primary" onClick={() => { void appWindow.hide() }}>
        <i className="iconfont icon-quit text-xl" title="退出" />
      </button>
      {contextHolder}
    </ul>
  )
})

SettingsBar.displayName = 'SettingsBar'
export default SettingsBar
