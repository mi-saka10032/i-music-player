import { useCallback, useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { clearCookie, getCookie } from '@/utils'
import { createAtomWithIndexedDB } from './persist'
import { getAccountInfo } from '@/api'

export const cookieAtom = createAtomWithIndexedDB<string>({
  cacheName: 'cookie',
  initialValue: getCookie() ?? ''
})

export const accountAtom = createAtomWithIndexedDB<AccountInfoRes>({
  cacheName: 'account',
  initialValue: { code: 0 }
})

export function useCookie () {
  const [cookie, setCookie] = useAtom(cookieAtom)

  return {
    cookie,
    setCookie,
    clearCookie
  }
}

export function useAccount () {
  const [cookie, setCookie] = useAtom(cookieAtom)

  const [accountInfo, setAccountInfo] = useAtom(accountAtom)

  const fetchAccountInfo = useCallback(async () => {
    const result = await getAccountInfo()
    void setAccountInfo(result)
  }, [])

  const clearAccountInfo = useCallback(() => {
    void setAccountInfo({ code: 0 })
    void setCookie('')
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
