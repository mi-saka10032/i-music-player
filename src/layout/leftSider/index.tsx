import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Popover, Button, message } from 'antd'
import { focusWindow, getLoginWindow, initLogin } from '@/utils'
import { useAccount, useRecommend } from '@/hooks'
import { getUserPlaylist } from '@/api'
import DefaultUserIcon from '@/assets/svg/user.svg?react'
import styles from './index.module.less'

interface LeftSiderMenu {
  to: string
  title: string
  needLogin: boolean
  icon?: string
}

interface MenusProps {
  logged: boolean
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
    if (needLogin && !props.logged) {
      void messageApi.open({
        type: 'warning',
        content: '请先登录',
        duration: 1
      })
    } else {
      navigate(to)
    }
  }, [props.logged])

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
                    { item.icon != null ? <i className={`mr-1 iconfont icon-${item.icon} text-base`}></i> : null }
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
  const { accountInfo, logged, clearAccountInfo, fetchAccountInfo, setCookie } = useAccount()

  const { fetchRecommendMap } = useRecommend()

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
    if (logged) {
      return {
        avatarUrl: accountInfo.profile?.avatarUrl,
        nickname: accountInfo.profile?.nickname
      }
    } else {
      return {
        avatarUrl: undefined,
        nickname: '未登录'
      }
    }
  }, [logged])

  // 判断cookie来创建登录弹窗
  const handleLogin = useCallback((newOpen: boolean) => {
    if (logged) {
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
        setCookie(res.cookie)
        void fetchAccountInfo()
        void fetchRecommendMap()
      })
      .catch(error => {
        console.log(error)
      })
  }, [logged])

  // 正式退出
  const exit = useCallback(() => {
    setCreatedMenu([])
    setShowCreated(false)
    setSubscribedMenu([])
    setShowSubscribed(false)
    clearAccountInfo()
    setLogout(false)
    void fetchRecommendMap()
  }, [logged])

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
  }, [logged])

  return (
    <div className={`h-full overflow-auto ${styles.toggle_scroll}`}>
      <Popover
        content={<Button danger type="text" size="small" onClick={exit}>退出登录</Button>}
        trigger={ logged ? 'hover' : 'click' }
        placement="rightTop"
        open={logout}
        onOpenChange={handleLogin}
      >
        <div className="h-14 my-2 py-1 px-3 cursor-pointer">
          <div className="flex items-center">
            {
              userInfo.avatarUrl != null
                ? <img
                    className="w-12 h-12 bg-[#e0e0e0] rounded-full shadow-inner"
                    src={userInfo.avatarUrl}
                  />
                : <DefaultUserIcon className="w-12 h-12 bg-[#e0e0e0] rounded-full shadow-inner" />
            }
            <div className="max-w-[150px] pl-3 pr-2 leading-4 font-[500] truncate">
              {userInfo.nickname}
            </div>
            <div className="border-l-[6px] border-y-4 divide-solid border-y-[transparent] border-l-[#8e8e8e]"></div>
          </div>
        </div>
      </Popover>
      {/* 通用菜单 */}
      <Menus
        logged={logged}
        menus={commonMenu}
      />
      <div className="px-6 py-2 text-sm leading-none text-[#999]">我的音乐</div>
      <Menus
        logged={logged}
        menus={myMusicMenu}
      />
      <div
        className="flex items-center px-6 py-2 text-sm leading-none text-[#999] group/created cursor-pointer"
        onClick={() => { setShowCreated(!showCreated) }}
      >
        创建的歌单
        {
          logged && createdMenu.length > 0
            ? (<i className={`triangle ml-1 group-hover/created:border-l-[#333] ${showCreated ? 'rotate-90' : ''}`} />)
            : null
        }
      </div>
      {
        showCreated
          ? (<Menus
              logged={logged}
              menus={createdMenu}
            />)
          : null
      }
      <div
        className="flex items-center px-6 py-2 text-sm leading-none text-[#999] group/sub cursor-pointer"
        onClick={() => { setShowSubscribed(!showSubscribed) }}
      >
        收藏的歌单
        {
          logged && subscribedMenu.length > 0
            ? (<i className={`triangle ml-1 group-hover/sub:border-l-[#333] ${showSubscribed ? 'rotate-90' : ''}`} />)
            : null
        }
      </div>
      {
        showSubscribed
          ? (<Menus
              logged={logged}
              menus={subscribedMenu}
          />)
          : null
      }
    </div>
  )
})

LeftSider.displayName = 'LeftSider'
export default LeftSider
