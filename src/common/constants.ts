/** 1px 透明图片 */
export const BLANK_IMG: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/** window name: 登录窗口 */
export const LOGIN_WINDOW_NAME: string = 'login'

/** event name: 登录成功 */
export const LOGIN_SUCCESS: string = 'login-success'

/** system tray event */
export const SWITCH_PLAY_STATUS = 'play_status'

export const SWITCH_PREV = 'prev'

export const SWITCH_NEXT = 'next'

export const SWITCH_REPEAT_MODE = 'repeat_mode'

/** system tray event */

/** 初始化state */
export const INITIAL_STATE_LOADED: string = 'INITIAL_STATE_LOADED'

export const PLAY_ALL_BUTTON_ID: string = 'UNIQUE_PLAY_ALL'

// 登录状态码
export enum LoginCode {
  EXPIRED = 800,
  CODING,
  WAITING,
  SUCCESS
}
