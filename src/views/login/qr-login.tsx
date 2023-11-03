import { memo, useEffect, useMemo, useRef, useState } from 'react'
import Api from '@/api/login'
import { setCookie, openUrl, closeCurrentWindow, flatCookies } from '@/utils'
import { emit } from '@tauri-apps/api/event'
import { LOGIN_SUCCESS } from '@/common/constants'

// 登录状态码
enum LoginCode {
  EXPIRED = 800,
  CODING,
  WAITING,
  SUCCESS
}

// 显示登录状态
interface QRContentProps {
  qrimg: string
  status: number
  onRefresh: () => void
}

// 开启下载页
function handleOpen () {
  openUrl('https://music.163.com/#/download')
}

// QR码状态页
const QRContent = memo(({ qrimg, status, onRefresh }: QRContentProps) => {
  return (
    <>
      <div
        className="relative w-60 h-60 bg-[length:100%_100%]"
        style={{ backgroundImage: `url("${qrimg}")` }}
      >
        {
          status === LoginCode.EXPIRED
            ? (
              <div className="flex flex-col items-center justify-center absolute w-full h-full bg-black/80 text-while">
                <div>二维码已失效</div>
                <button
                  className="mt-4 px-4 py-1.5 bg-primary rounded-full"
                  onClick={onRefresh}
                  >
                  点击刷新
                </button>
              </div>
              )
            : null
        }
      </div>
      <div className="mt-2">
        使用
        <button className="text-[#3371bc]  font-[500]" onClick={handleOpen}>
          网易云音乐APP
        </button>
        扫码登录
      </div>
    </>
  )
})

QRContent.displayName = 'QRContent'
const QRLogin = memo(() => {
  const [qrimg, setQrimg] = useState<string>('')
  const [status, setStatus] = useState(0)
  const qrUserInfo = useRef<QRStatusInfo>({ code: 0 })
  const timer = useRef<number | undefined>()
  const key = useRef<string>('')
  // 扫码完成 等待验证或验证成功状态
  const pendingStatus = [LoginCode.WAITING, LoginCode.SUCCESS]

  // 确认登录中状态
  const UserContent = useMemo(() => {
    return pendingStatus.includes(status)
      ? (
        <>
          <img
            className="mt-4 w-40 h-40 rounded-full"
            src={qrUserInfo.current.avatarUrl}
        />
          <div className="mt-2 w-2/4 text-base text-center font-bol font-[500] truncate">
            {qrUserInfo.current.nickname}
          </div>
          <div className="mt-8 text-sm text-[#888888] font-[500]">扫描成功</div>
          <div className="mt-2 text-lg font-[500]">请在手机上确认登录</div>
        </>
        )
      : null
  }, [status])

  // 状态轮询
  async function pollingCheck () {
    const statusRes = await Api.loginQrCheck({ key: key.current })
    setStatus(statusRes.data.code)
    switch (statusRes.data.code) {
      case LoginCode.EXPIRED: // 二维码已过期,请重新获取
      {
        clearInterval(timer.current)
        break
      }
      case LoginCode.CODING: // 等待扫码
        break
      case LoginCode.WAITING: // 扫描成功, 待授权
      {
        qrUserInfo.current = statusRes.data
        break
      }
      case LoginCode.SUCCESS: // 授权登录成功
      {
        // 拉平cookies并设置localStorage
        const cookies = statusRes.rawHeaders['set-cookie'] ?? []
        const cookie = flatCookies(cookies)
        setCookie(cookie)
        // 清除定时器
        clearInterval(timer.current)
        // 发送tauri事件
        void emit(LOGIN_SUCCESS, { cookie })
        // 关闭登录窗口
        closeCurrentWindow()
        break
      }
      default:
        break
    }
  }

  function reset () {
    key.current = ''
    qrUserInfo.current = { code: 0 }
    clearInterval(timer.current)
    setStatus(0)
    setQrimg('')
  }

  // 获取key值，set QR码，开启轮询
  async function login () {
    reset()
    const keyResult = await Api.getLoginQrKey()
    key.current = keyResult.unikey
    const qrResult = await Api.loginQrCreate({ key: key.current, qrimg: true })
    setQrimg(qrResult.data.qrimg)
    timer.current = window.setInterval(pollingCheck, 1000)
  }

  useEffect(() => {
    void login()
    return reset
  }, [])

  return (
    <div
      data-tauri-drag-region
      className="w-full h-full pt-28 flex flex-col items-center"
    >
      <h1 className="text-3xl pb-4 font-bold">扫码登录</h1>
      {
        pendingStatus.includes(status)
          ? UserContent
          : <QRContent qrimg={qrimg} status={status} onRefresh={login} />
      }
    </div>
  )
})

QRLogin.displayName = 'QRLogin'
export default QRLogin
