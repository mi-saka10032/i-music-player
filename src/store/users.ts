import { getCookie } from '@/utils'
import { createAtomWithIndexedDB } from './persist'

export const cookieAtom = createAtomWithIndexedDB<string>({
  cacheName: 'cookie',
  initialValue: getCookie() ?? ''
})

export const accountAtom = createAtomWithIndexedDB<AccountInfoRes>({
  cacheName: 'account',
  initialValue: { code: 0 }
})
