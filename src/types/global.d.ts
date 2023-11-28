declare module '*.less'

declare module '*.png'

// Netease响应值结构
interface CommonRes {
  code: number
  [key: string]: any
}

// Vite全局import.meta类型
interface ImportMetaEnv {
  [key: string]: any
  BASE_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
  SSR: boolean
}

interface ImportMeta {
  url: string
  readonly env: ImportMetaEnv
}
