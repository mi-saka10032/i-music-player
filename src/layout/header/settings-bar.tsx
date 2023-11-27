import { memo, type ButtonHTMLAttributes, useRef } from 'react'
import MinimizeIcon from '@/assets/svg/icon_minimize.svg?react'
import MaxIcon from '@/assets/svg/icon_max.svg?react'
import QuitIcon from '@/assets/svg/icon_quit.svg?react'
import { detectOS } from '@/utils'
import { appWindow } from '@tauri-apps/api/window'

interface ButtonAttr extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string
  active?: boolean
}

const IconBtn = memo(({ icon, title, active, disabled, onClick }: ButtonAttr) => {
  return (
    <button
      className={`flex items-center justify-center iconfont icon-${icon} w-7 h-7 text-xl rounded-full ${
        active === true ? 'text-primary' : 'text-ct'
      } enabled:hover:bg-[#e9e9e9] disabled:opacity-10`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    ></button>
  )
})

IconBtn.displayName = 'IconBtn'

const SettingsBar = memo(() => {
  const isWindows = useRef(detectOS() === 'Windows')
  return (
    <ul className="flex space-x-4">
      <li>
        <div className="relative">
          <i className="absolute left-2 top-2/4 pt-0.5 -translate-y-1/2 iconfont icon-search text-ct text-base"></i>
          <input
            type="search"
            className="w-44 h-7 leading-7 py-1 pl-7 pr-2 text-sm outline-none border-0 rounded-full bg-[#e9e9e9]"
            placeholder="搜索"
          />
        </div>
      </li>
      <li>
        <IconBtn icon="setting" />
      </li>
      <li>
        <IconBtn icon="mail" />
      </li>
      <li>
        <IconBtn icon="theme" />
      </li>
      <li>
        <IconBtn icon="mini" />
      </li>
      {
        isWindows.current
          ? (
            <>
              <button onClick={() => { void appWindow.minimize() }}>
                <MinimizeIcon className="w-5 h-5" />
              </button>
              <button onClick={() => { void appWindow.toggleMaximize() }}>
                <MaxIcon className="w-5 h-5" />
              </button>
              <button onClick={() => { void appWindow.close() }}>
                <QuitIcon className="w-5 h-5" />
              </button>
            </>
            )
          : null
      }
    </ul>
  )
})

SettingsBar.displayName = 'SettingsBar'
export default SettingsBar
