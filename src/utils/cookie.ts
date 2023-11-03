export function getCookie (): string {
  return localStorage.getItem('i-music-cookie') ?? ''
}

export function setCookie (cookie: string) {
  localStorage.setItem('i-music-cookie', cookie)
}

export function clearCookie () {
  localStorage.removeItem('i-music-cookie')
}

// 拉平cookies数组并拼接为初始cookie字符串
export function flatCookies (cookies: string[]): string {
  return cookies.map(cookie => cookie.replace(/\s*Domain=[^(;|$)]+;*/, '')).join('; ')
}
