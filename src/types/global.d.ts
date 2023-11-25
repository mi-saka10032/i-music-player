declare module '*.less'

declare module '*.png'

// Netease响应值结构
interface CommonRes {
  code: number
  [key: string]: any
}
