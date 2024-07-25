import { useCallback, useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { accountAtom, cookieAtom } from '@/store'
import { getAccountInfo } from '@/api'
import { clearCookie } from '@/utils'

export function useAccount () {
  const [cookie, setCookie] = useAtom(cookieAtom)

  const [accountInfo, setAccountInfo] = useAtom(accountAtom)

  const fetchAccountInfo = useCallback(async () => {
    const result = await getAccountInfo()
    setAccountInfo(result)
  }, [])

  const clearAccountInfo = useCallback(() => {
    setAccountInfo({ code: 0 })
    setCookie('')
    clearCookie()
  }, [])

  const logged = useMemo(() => cookie.length > 0 && accountInfo.profile != null, [accountInfo, cookie])

  useEffect(() => {
    if (cookie.length > 0) {
      void fetchAccountInfo()
    }
  }, [])

  return {
    accountInfo,
    cookie,
    logged,
    clearAccountInfo,
    fetchAccountInfo,
    setCookie
  }
}
