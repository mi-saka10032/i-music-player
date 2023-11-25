import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Popover, Button, message } from 'antd'
import { focusWindow, getLoginWindow, initLogin } from '@/utils'
import { fetchAccountInfo, setCookie, setAccountInfo } from '@/store/user'
import { fetchRecommendData } from '@/store/cache'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getUserPlaylist } from '@/api'

interface LeftSiderMenu {
  to: string
  title: string
  needLogin: boolean
  icon?: string
}

interface MenusProps {
  hasLogin: boolean
  menus: LeftSiderMenu[]
}

// 菜单渲染组件
const Menus = memo((props: MenusProps) => {
  const navigate = useNavigate()
  // 登录跳转提示信息
  const [messageApi, contextHolder] = message.useMessage()

  // 判断link菜单是否允许跳转
  const linkJudge = useCallback(({ event, needLogin, to }: LeftSiderMenu & { event: React.MouseEvent }) => {
    event.preventDefault()
    if (needLogin && !props.hasLogin) {
      void messageApi.open({
        type: 'warning',
        content: '请先登录',
        duration: 1
      })
    } else {
      navigate(to)
    }
  }, [props.hasLogin])

  return (
    <>
      <ul>
        {
          props.menus.map((item, index) => {
            const key = String(item.to + index)
            return (
              <li key={key}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => ((isActive ? 'text-primary active' : 'text-[#333]') + ' group/navlink')}
                  onClick={event => { linkJudge({ event, ...item }) }}
              >
                  <div className="flex items-center px-6 py-2 group-hover/navlink:bg-ctd/10 group-[.active]/navlink:bg-ctd/10">
                    { item.icon != null ? <i className={`mr-1 iconfont icon-${item.icon} text-xl`}></i> : null }
                    <span className="flex-1 text-ellipsis">{item.title}</span>
                  </div>
                </NavLink>
              </li>
            )
          })
        }
      </ul>
      { contextHolder }
    </>
  )
})
Menus.displayName = 'Menus'

/** 左侧边栏组件 */
const LeftSider = memo(() => {
  const { accountInfo, cookie } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  // 登录状态判断
  const hasLogin = useMemo(() => cookie != null && accountInfo.profile != null, [accountInfo, cookie])
  // 退出登录popover显示状态
  const [logout, setLogout] = useState(false)

  // 通用菜单
  const [commonMenu] = useState<LeftSiderMenu[]>([
    { to: '/discovery', title: '发现音乐', needLogin: false }
  ])

  // 我的音乐
  const favoriteRef = useRef<LeftSiderMenu>({ to: '/musicDetail', title: '我喜欢的音乐', icon: 'like', needLogin: true })
  const [myMusicMenu, setMyMusicMenu] = useState<LeftSiderMenu[]>([favoriteRef.current])

  // 创建歌单
  const [createdMenu, setCreatedMenu] = useState<LeftSiderMenu[]>([])
  const [showCreated, setShowCreated] = useState(true)

  // 收藏歌单
  const [subscribedMenu, setSubscribedMenu] = useState<LeftSiderMenu[]>([])
  const [showSubscribed, setShowSubscribed] = useState(false)

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
  }, [hasLogin])

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

  // 正式退出
  const exit = useCallback(() => {
    dispatch(setCookie(''))
    dispatch(setAccountInfo({ code: 0 }))
    setCreatedMenu([])
    setShowCreated(false)
    setSubscribedMenu([])
    setShowSubscribed(false)
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

  // 用户登录后获取喜欢音乐、歌单信息
  useEffect(() => {
    const uid = accountInfo.account?.id
    if (uid == null) return
    getUserPlaylist(Number(uid))
      .then(res => {
        let favoriteId: number = 0
        const createdLists: LeftSiderMenu[] = []
        const subscribedLists: LeftSiderMenu[] = []
        res.playlist.forEach(item => {
          if (item.specialType === 5) {
            favoriteId = item.id
          } else {
            const menu: LeftSiderMenu = {
              to: `/musicDetail/${item.id}`,
              title: item.name,
              needLogin: true,
              icon: 'music'
            }
            if (item.subscribed) {
              subscribedLists.push(menu)
            } else {
              createdLists.push(menu)
            }
          }
        })
        if (favoriteId !== 0) {
          favoriteRef.current.to = '/musicDetail/' + favoriteId
          setMyMusicMenu([favoriteRef.current])
        }
        if (createdLists.length > 0) {
          setCreatedMenu(createdLists)
        }
        if (subscribedLists.length > 0) {
          setSubscribedMenu(subscribedLists)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [hasLogin])

  return (
    <>
      <Popover
        content={<Button danger type="text" size="small" onClick={exit}>退出登录</Button>}
        trigger={ hasLogin ? 'hover' : 'click' }
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
      {/* 通用菜单 */}
      <Menus
        hasLogin={hasLogin}
        menus={commonMenu}
      />
      <div className="px-6 py-2 text-sm leading-none text-[#999]">我的音乐</div>
      <Menus
        hasLogin={hasLogin}
        menus={myMusicMenu}
      />
      <div
        className="flex items-center px-6 py-2 text-sm leading-none text-[#999] group/created cursor-pointer"
        onClick={() => { setShowCreated(!showCreated) }}
      >
        创建的歌单
        <i className="triangle ml-1 group-hover/created:border-l-[#333]" />
      </div>
      <div className={showCreated ? '' : 'hidden'}>
        <Menus
          hasLogin={hasLogin}
          menus={createdMenu}
        />
      </div>
      <div
        className="flex items-center px-6 py-2 text-sm leading-none text-[#999] group/sub cursor-pointer"
        onClick={() => { setShowSubscribed(!showSubscribed) }}
      >
        收藏的歌单
        <i className="triangle ml-1 group-hover/sub:border-l-[#333]" />
      </div>
      <div className={showSubscribed ? '' : 'hidden'}>
        <Menus
          hasLogin={hasLogin}
          menus={subscribedMenu}
        />
      </div>
    </>
  )
})

LeftSider.displayName = 'LeftSider'
export default LeftSider
