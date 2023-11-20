import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Popover, Button } from 'antd'
import { focusWindow, getLoginWindow, initLogin } from '@/utils'
import { fetchAccountInfo, setCookie, setAccountInfo } from '@/store/user'
import { fetchRecommendData } from '@/store/cache'
import { useAppSelector, useAppDispatch } from '@/hooks'

const links = [
  { to: '/discovery', title: '发现音乐', icon: 'music' },
  { to: '/my', title: '我喜欢的音乐', icon: 'like' }
]

/** 左侧边栏组件 */
const LeftSider = memo(() => {
  const { accountInfo, cookie } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  // 登录状态判断
  const hasLogin = useMemo(() => cookie != null && accountInfo.profile != null, [accountInfo, cookie])
  const [logout, setLogout] = useState(false)
  // 监听数据变化以切换显示用户名和头像
  const userInfo = useMemo(() => {
    if (hasLogin) {
      return {
        avatarUrl: accountInfo.profile?.avatarUrl,
        nickname: accountInfo.profile?.nickname
      }
    } else {
      return {
        avatarUrl: '/svg/user.svg',
        nickname: '未登录'
      }
    }
  }, [hasLogin, accountInfo])

  // 判断cookie来创建登录弹窗
  const handleLogin = useCallback((newOpen: boolean) => {
    if (hasLogin) {
      setLogout(newOpen)
      return
    }
    const loginWindow = getLoginWindow()
    // 如果登录弹窗已创建，则聚焦该弹窗，不再新建
    if (loginWindow != null) {
      focusWindow(loginWindow)
      return
    }
    // 该登录函数将持续pending直到登录弹窗关闭为止
    void initLogin()
      .then(res => {
        dispatch(setCookie(res.cookie))
        void dispatch(fetchAccountInfo())
        void dispatch(fetchRecommendData())
      })
      .catch(error => {
        console.log(error)
      })
  }, [hasLogin])

  const exit = useCallback(() => {
    dispatch(setCookie(''))
    dispatch(setAccountInfo({ code: 0 }))
    setLogout(false)
    void dispatch(fetchRecommendData())
    console.log('退出登录')
  }, [hasLogin])

  // 挂载时判断cookie有效性，来调取用户信息
  useEffect(() => {
    if (cookie.length > 0) {
      void dispatch(fetchAccountInfo())
    }
  }, [])

  return (
    <>
      <Popover
        content={<Button danger type="text" size="small" onClick={exit}>退出登录</Button>}
        trigger="click"
        placement="rightTop"
        open={logout}
        onOpenChange={handleLogin}
      >
        <div className="h-14 my-2 py-1 px-3 cursor-pointer">
          <div className="flex items-center">
            <img
              className="w-12 h-12 bg-[#e0e0e0] rounded-full shadow-inner"
              src={userInfo.avatarUrl}
            />
            <div className="max-w-[150px] pl-3 pr-2 leading-4 font-[500] truncate">
              {userInfo.nickname}
            </div>
            <div className="border-l-[6px] border-y-4 divide-solid border-y-[transparent] border-l-[#8e8e8e]"></div>
          </div>
        </div>
      </Popover>
      <ul>
        {
          links.map((item) => {
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => {
                    return (
                      (isActive ? 'text-primary active' : 'text-ct') +
                      ' group/navlink'
                    )
                  }}
                >
                  <div className="flex items-center px-6 py-2 group-hover/navlink:bg-ctd/10 group-[.active]/navlink:bg-ctd/10">
                    <i className={`iconfont icon-${item.icon} text-xl`}></i>
                    <span className="ml-1">{item.title}</span>
                  </div>
                </NavLink>
              </li>
            )
          })
        }
      </ul>
    </>
  )
})

LeftSider.displayName = 'LeftSider'
export default LeftSider
