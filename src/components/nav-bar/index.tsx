import { memo } from 'react'
import { NavLink } from 'react-router-dom'

// 导航栏组件
const NavBar = memo(() => {
  const navList = [
    {
      to: '/discovery',
      title: '个性推荐'
    },
    {
      to: '/discovery/playlist',
      title: '歌单'
    },
    {
      to: '/discovery/toplist',
      title: '排行榜'
    },
    {
      to: '/discovery/artist',
      title: '歌手'
    },
    {
      to: '/discovery/album',
      title: '最新音乐'
    }
  ]
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
            >
              <span>{item.title}</span>
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
})

NavBar.displayName = 'NavBar'
export default NavBar
