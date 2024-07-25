import { getCookie } from '@/utils'
import { createAtomWithIndexedDB } from './persist'

export const COOKIE_CACHE_NAME = 'cookie'

export const cookieAtom = createAtomWithIndexedDB<string>({
  cacheName: COOKIE_CACHE_NAME,
  initialValue: getCookie() ?? ''
})

export const ACCOUNT_CACHE_NAME = 'account'

export const accountAtom = createAtomWithIndexedDB<AccountInfoRes>({
  cacheName: ACCOUNT_CACHE_NAME,
  initialValue: { code: 0 }
})
