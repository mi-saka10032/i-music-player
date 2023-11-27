import { memo, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { message } from 'antd'

interface NavBarList {
  to: string
  title: string
  disabled: boolean
}

// 导航栏组件
const NavBar = memo(() => {
  const navList: NavBarList[] = [
    {
      to: '/discovery',
      title: '个性推荐',
      disabled: false
    },
    {
      to: '/discovery/playlist',
      title: '歌单',
      disabled: true
    },
    {
      to: '/discovery/toplist',
      title: '排行榜',
      disabled: true
    },
    {
      to: '/discovery/artist',
      title: '歌手',
      disabled: true
    },
    {
      to: '/discovery/album',
      title: '最新音乐',
      disabled: true

    }
  ]

  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const linkJudge = useCallback((e: React.MouseEvent, item: NavBarList) => {
    e.preventDefault()
    if (item.disabled) {
      void messageApi.open({
        type: 'warning',
        content: '功能制作中',
        duration: 1
      })
      return
    }
    navigate(item.to)
  }, [])

  return (
    <ul className="flex space-x-8">
      {navList.map((item) => {
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) => {
                return isActive
                  ? 'text-ct font-bold'
                  : 'text-ctd hover:text-ct font-bold'
              }}
              onClick={e => { linkJudge(e, item) }}
            >
              <span>{item.title}</span>
            </NavLink>
          </li>
        )
      })}
      {contextHolder}
    </ul>
  )
})

NavBar.displayName = 'NavBar'
export default NavBar
