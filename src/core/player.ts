import { Howl, Howler } from 'howler'
import mitt, { type Emitter } from 'mitt'
import { PlayType, type SongData, PlayerEvent, type PlayerState, type MittEvents } from './playerType.ts'
import { getSongUrl } from '@/api'
import { formatImgUrl } from '@/utils/url.ts'

export class Player {
  /** pub/sub 事件订阅 */
  private readonly emitter: Emitter<MittEvents<this>> = mitt<MittEvents<this>>()
  public on = this.emitter.on.bind(this.emitter)
  public off = this.emitter.off.bind(this.emitter)
  public emit = this.emitter.emit.bind(this.emitter)
  /** pub/sub 事件订阅 */

  /** 当前曲目 */
  get current (): SongData {
    return this._playlist[this._index]
  }
  /** 当前曲目 */

  /** 获取当前howl实例 */
  public getCurrentHowl (): Howl | null {
    return this.current?.howl ?? null
  }

  /** 歌单列表 */
  public _playlist: SongData[] = []
  get playlist (): SongData[] {
    return this._playlist
  }

  set playlist (value: SongData[]) {
    if (value === this._playlist) return
    this._playlist = value
    this.emit(PlayerEvent.PLAYLIST_CHANGE, value)
  }
  /** 歌单列表 */

  /** 曲目索引 */
  private _index: number = 0
  private debounceIndex: number = 0
  get index (): number {
    return this._index
  }

  set index (value: number) {
    if (value === this._index) return
    this._index = value
    this.emit(PlayerEvent.INDEX_CHANGE, value)
    const id = this.playlist[value]?.id ?? 0
    this.emit(PlayerEvent.ID_CHANGE, id)
  }
  /** 曲目索引 */

  /** 歌单循环播放类型 */
  private _repeatMode: PlayType = PlayType.loop
  get repeatMode (): PlayType {
    return this._repeatMode
  }

  set repeatMode (value: PlayType) {
    if (value === this._repeatMode) return
    this._repeatMode = value
    this.emit(PlayerEvent.PLAY_TYPE_CHANGE, value)
  }
  /** 歌单循环播放类型 */

  /** 音量 volume 0-100 */
  private _volume: number = 60
  get volume (): number {
    return this._volume
  }

  set volume (value: number) {
    if (value === this._volume) return
    this._volume = value
    this.emit(PlayerEvent.VOLUME_CHANGE, value)
  }
  /** 音量 volume 0-100 */

  /** 是否静音 */
  private _mute: boolean = false
  get mute (): boolean {
    return this._mute
  }

  set mute (value: boolean) {
    if (value === this._mute) return
    this._mute = value
    this.emit(PlayerEvent.MUTE_CHANGE, value)
  }
  /** 是否静音 */

  /** 播放状态 */
  private _status: MediaSessionPlaybackState = 'none'
  get status (): MediaSessionPlaybackState {
    return this._status
  }

  set status (value: MediaSessionPlaybackState) {
    if (value === this._status) return
    this._status = value
    this.emit(PlayerEvent.STATUS_CHANGE, value)
  }
  /** 播放状态 */

  /** 歌曲时长 duration (s) */
  private _duration: number = 0
  get duration (): number {
    return this._duration
  }

  set duration (value: number) {
    if (value === this._duration) return
    this._duration = value
    this.emit(PlayerEvent.DURATION_CHANGE, value)
  }
  /** 歌曲时长 duration (s) */

  /** 歌曲进度 progress 0-100 */
  private _progress: number = 0
  get progress (): number {
    return this._progress
  }

  set progress (value: number) {
    if (value === this._progress) return
    this._progress = value
    this.emit(PlayerEvent.PROGRESS_CHANGE, value)
  }
  /** 歌曲进度 progress 0-100 */

  /** 获取完整播放信息 */
  get state (): PlayerState {
    return {
      howl: this.getCurrentHowl(),
      id: this.current.id,
      status: this.status,
      repeatMode: this.repeatMode,
      volume: this.volume,
      mute: this.mute,
      duration: this.duration,
      progress: this.progress
    }
  }
  /** 获取完整播放信息 */

  /** 初始化 */
  constructor (playlist: SongData[], index: number = 0, repeatMode = PlayType.loop, volume: number = 100, mute: boolean = false) {
    this.setPlaylist(playlist, index)
    this.setRepeatMode(repeatMode)
    this.setVolume(volume)
    this.setMute(mute)
    if ('mediaSession' in window.navigator) {
      const mediaSession = window.navigator.mediaSession
      mediaSession.setActionHandler('nexttrack', () => { this.next() })
      mediaSession.setActionHandler('pause', () => { this.pause() })
      mediaSession.setActionHandler('play', () => { this.play() })
      mediaSession.setActionHandler('previoustrack', () => { this.prev() })
      mediaSession.setActionHandler('seekto', details => { this.seekTo(details.seekTime) })
      mediaSession.setActionHandler('stop', () => { this.stop() })
    }
  }

  /** 设置歌曲列表 */
  public setPlaylist (playlist: SongData[], index: number = 0, autoplay: boolean = false) {
    this.reset()
    this.playlist = playlist.map(item => {
      return {
        id: item.id,
        name: item.name,
        artists: item.artists,
        album: item.album,
        howl: null,
        url: item.url ?? '',
        time: item.time ?? 0
      }
    })
    this._index = -1
    void this.setIndex(index, autoplay)
  }

  /** 切换曲目（ID） */
  public setId (id: number) {
    if (this._playlist.length === 0) return
    const index = this._playlist.findIndex(item => item.id === id)
    void this.setIndex(index, true)
  }
  /** 切换曲目（ID） */

  /** 切换曲目（索引） */
  public async setIndex (index: number, autoplay: boolean = true) {
    if (this.index === index) return
    const beforeHowl = this.getCurrentHowl()
    if (beforeHowl != null) {
      this.removeListeners(beforeHowl)
      beforeHowl.stop()
    }
    this.index = index
    // 防抖索引，多次切换歌曲但歌曲初始化未完成，将跳过howl的init
    this.debounceIndex = index
    if (this.playlist[index] == null) return
    if (this.playlist[index].howl == null) {
      try {
        // 应对自定义歌单，每首歌获取时自带url，不进入该判断逻辑
        if (this.playlist[index].url == null || this.playlist[index].url?.length === 0) {
          // 应对网易云歌单，每首歌需要单独根据id获取url
          const { url, time } = await getSongUrl(this.playlist[index].id).then(res => res.data[0])
          // url不存在时抛出异常
          if (url?.length > 0) {
            this.playlist[index].url = url
            this.playlist[index].time = time
          } else {
            throw new Error('invalid audio')
          }
        }
        this.playlist[index].howl = new Howl({
          src: [String(this.playlist[index].url)],
          html5: true, // 优化音频加载
          pool: 20 // 增大缓冲池
        })
      } catch (error) {
        console.warn(error)
        this.emit(PlayerEvent.INVALID, this.state)
      }
    }
    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.metadata = new window.MediaMetadata({
        title: this.playlist[index].name,
        artist: this.playlist[index].artists.map(a => a.name).join(' / '),
        album: this.playlist[index].album.name,
        artwork: [{ src: `${formatImgUrl(this.playlist[index].album.picUrl ?? '', 128)}`, sizes: '128x128' }]
      })
    }
    if (this.debounceIndex !== index) return
    const howl = this.getCurrentHowl()
    if (howl == null) return
    this.status = 'none'
    howl.loop(this.repeatMode === PlayType.single)
    this.initListeners(howl)
    this.duration = Number(this.current.time) > 0 ? Number(this.current.time) / 1000 : 0
    this.progress = 0
    if (autoplay) {
      this.play()
    }
    this.emit(PlayerEvent.CHANGE, this.state)
  }

  /** 播放进度更新 */
  private requestId: number = 0
  public update () {
    this.step()
    const howl = this.getCurrentHowl()
    if (howl == null) return
    window.clearTimeout(this.requestId)
    if (howl.playing() || this.status === 'playing') {
      this.requestId = window.setTimeout(() => { this.update() }, 500)
    }
  }

  /** play 监听回调 */
  private readonly onPlay = () => {
    this.status = 'playing'
    this.update()
    this.emit(PlayerEvent.PLAY, this.state)
    this.emit(PlayerEvent.CHANGE, this.state)
    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.playbackState = this.status
    }
  }

  /** pause 监听回调 */
  private readonly onPause = () => {
    this.status = 'paused'
    this.emit(PlayerEvent.PAUSE, this.state)
    this.emit(PlayerEvent.CHANGE, this.state)
    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.playbackState = this.status
    }
  }

  /** stop 监听回调 */
  private readonly onStop = () => {
    this.status = 'none'
    this.emit(PlayerEvent.STOP, this.state)
    this.emit(PlayerEvent.CHANGE, this.state)
    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.playbackState = this.status
    }
  }

  /** end 监听回调 */
  private readonly onEnd = () => {
    switch (this.repeatMode) {
      case PlayType.loop:
      case PlayType.random:
        this.next()
        break
      case PlayType.single:
        break
      case PlayType.sequential:
        if (this.index < this.playlist.length - 1) {
          this.next()
        }
        break

      default:
        break
    }
    this.status = 'none'
    this.emit(PlayerEvent.END, this.state)
    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.playbackState = this.status
    }
  }

  /** seek 监听回调 */
  private readonly onSeek = () => {
    this.emit(PlayerEvent.SEEK, this.state)
  }

  /** 挂载howl监听事件 */
  private initListeners (howl: Howl) {
    howl.on('play', this.onPlay)
    howl.on('pause', this.onPause)
    howl.on('stop', this.onStop)
    howl.on('end', this.onEnd)
    howl.on('seek', this.onSeek)
  }

  /** 卸载howl监听事件 */
  private removeListeners (howl: Howl) {
    howl.off('play', this.onPlay)
    howl.off('pause', this.onPause)
    howl.off('stop', this.onStop)
    howl.off('end', this.onEnd)
    howl.off('seek', this.onSeek)
  }

  /** 重置播放器实例 */
  public reset (): void {
    const howl = this.getCurrentHowl()
    if (howl != null) {
      this.removeListeners(howl)
      howl.stop()
    }
    this._playlist = []
    this._index = 0
    this._status = 'none'
    this._duration = 0
    this._progress = 0
    this.emit(PlayerEvent.RESET, this)
    Howler.unload()
    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.playbackState = this.status
      window.navigator.mediaSession.metadata = null
    }
  }

  /** 设置循环模式 */
  public setRepeatMode (mode: PlayType): void {
    this.repeatMode = mode
    const howl = this.getCurrentHowl()
    if (howl != null) {
      howl.loop(mode === PlayType.single)
    }
  }

  private randomIndex (): number {
    let random: number
    do {
      random = Math.floor(Math.random() * this.playlist.length)
    } while (random === this.index)
    return random
  }

  private nextIndex (): number {
    return this.index < this.playlist.length - 1 ? this.index + 1 : 0
  }

  private prevIndex (): number {
    return this.index > 0 ? this.index - 1 : this.playlist.length - 1
  }

  /** 下一首 */
  public next (): void {
    const index = this.repeatMode === 'random' ? this.randomIndex() : this.nextIndex()
    void this.setIndex(index, true)
  }

  /** 上一首 */
  public prev (): void {
    const index = this.repeatMode === 'random' ? this.randomIndex() : this.prevIndex()
    void this.setIndex(index, true)
  }

  /** 播放 */
  public play () {
    if (this.playlist.length === 0) return
    const howl = this.getCurrentHowl()
    if (howl == null) {
      console.warn('invalid audio')
      this.emit(PlayerEvent.INVALID, this.state)
      return
    }
    if (howl.playing()) return
    howl.play()
  }

  /** 停止 */
  public stop (): void {
    const howl = this.getCurrentHowl()
    if (howl == null) return
    howl.stop()
  }

  /** 暂停 */
  public pause (): void {
    const howl = this.getCurrentHowl()
    if (howl == null) return
    howl.pause()
  }

  /** 播放/暂停切换 */
  public switchPlay (): void {
    const howl = this.getCurrentHowl()
    if (howl == null) return
    if (howl.playing()) {
      this.pause()
    } else {
      this.play()
    }
  }

  /**
   * @description 跳转时间
   * @param seekTime 秒
   */
  public seekTo (seekTime?: number) {
    const howl = this.getCurrentHowl()
    if (howl != null) {
      howl.seek(seekTime)
    }
  }

  /**
   * @description 跳转进度
   * @param progress 0-100
   */
  public progressTo (progress: number) {
    const seekTime = Math.max(0, Math.min(100, progress)) / 100 * this.duration
    this.seekTo(seekTime)
  }

  /** 步进进度 */
  public step () {
    const howl = this.getCurrentHowl()
    if (howl == null) return
    const seekTime = howl.seek() ?? 0
    const duration = howl.duration() ?? 0
    const progress = duration > 0 ? (seekTime / duration) * 100 : 0
    this.progress = Math.max(0, Math.min(100, progress))
    this.duration = duration
    this.emit(PlayerEvent.CHANGE, this.state)

    if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.setPositionState({
        duration,
        position: seekTime
      })
    }
  }

  /**
   * @description 设置音量
   * @param volume 0-100
   */
  public setVolume (volume: number): void {
    const newVolume = Math.max(0, Math.min(100, volume))
    Howler.volume(newVolume / 100)
    this.volume = newVolume
  }

  /** 设置静音 */
  public setMute (mute: boolean): void {
    Howler.mute(mute)
    this.mute = mute
  }

  /** 播放实例初始化 */
  public init (state: InitState) {
    this.setVolume(state.volume)
    this.setMute(state.mute)
    this.setRepeatMode(state.repeatMode)
    this.setPlaylist(state.playlist, state.index)
  }
}

export interface InitState {
  volume: number
  mute: boolean
  repeatMode: PlayType
  playlist: SongData[]
  index: number
}

export * from './playerType.ts'

export default new Player([])
