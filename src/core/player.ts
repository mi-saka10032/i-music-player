import { Howler } from 'howler'
import { HackHowl } from './hackHowl.ts'
import { MediaSessionInstance } from './MediaSession.ts'
import mitt, { type Emitter } from 'mitt'
import {
  type PlayerState,
  type MittEvents,
  type SongOption,
  type InitState,
  PlayerEvent,
  PlayType
} from './playerType.ts'
import { getHiResSongUrl, getSongUrl } from '@/api'
import { formatImgUrl, replaceHttpsUrl } from '@/utils'

// use web audio
Howler.usingWebAudio = true

export class Player {
  /** pub/sub 事件订阅 */
  private readonly emitter: Emitter<MittEvents<this>> = mitt<MittEvents<this>>()
  public on = this.emitter.on.bind(this.emitter)
  public off = this.emitter.off.bind(this.emitter)
  public emit = this.emitter.emit.bind(this.emitter)

  static urlExpiration = 1000 * 60 * 5

  private autoplay: boolean = false

  /** 歌单列表 */
  private _playlist: SongData[] = []
  get playlist (): SongData[] {
    return this._playlist
  }

  set playlist (value: SongData[]) {
    if (value === this._playlist) return
    this._playlist = value
    this.emit(PlayerEvent.PLAYLIST_CHANGE, value)
  }

  /** 曲目索引 */
  private _index: number = 0
  get index (): number {
    return this._index
  }

  set index (value: number) {
    if (value === this._index) return
    this._index = value
    this.emit(PlayerEvent.INDEX_CHANGE, value)
    const id = this._playlist[value]?.id ?? 0
    this.emit(PlayerEvent.ID_CHANGE, id)
  }

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

  /** 播放状态 */
  private _status: MediaSessionPlaybackState = 'none'
  get status (): MediaSessionPlaybackState {
    return this._status
  }

  set status (value: MediaSessionPlaybackState) {
    if (value === this._status) return
    this._status = value
  }

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

  /** 当前howl唯一实例 */
  private howl: HackHowl | null = null
  get currentHowl (): HackHowl | null {
    return this.howl
  }

  set currentHowl (value: HackHowl | null) {
    this.howl = value
  }

  /** 挂载howl监听事件 */
  private initListeners () {
    if (this.currentHowl != null) {
      this.currentHowl.on('play', this.onPlay)
      this.currentHowl.on('pause', this.onPause)
      this.currentHowl.on('stop', this.onStop)
      this.currentHowl.on('end', this.onEnd)
      this.currentHowl.on('seek', this.onSeek)
    }
  }

  private removeListeners () {
    if (this.currentHowl != null) {
      this.currentHowl.off('play', this.onPlay)
      this.currentHowl.off('pause', this.onPause)
      this.currentHowl.off('stop', this.onStop)
      this.currentHowl.off('end', this.onEnd)
      this.currentHowl.off('seek', this.onSeek)
    }
  }

  private cleanHowl () {
    if (this.currentHowl != null) {
      this.removeListeners()
      this.currentHowl.unload()
      this.currentHowl = null
    }
  }

  private changeSong ({ hires, standard }: SongOption) {
    let url = ''
    if (hires != null && hires?.length > 0) {
      url = hires
    } else if (standard != null && standard?.length > 0) {
      url = standard
    } else {
      this.cleanHowl()
      return
    }

    const hackOption = {
      autoplay: this.autoplay,
      src: [replaceHttpsUrl(url)],
      mute: this.mute,
      volume: this.volume / 100
    }

    if (this.currentHowl == null) {
      this.currentHowl = new HackHowl({
        ...hackOption,
        loop: this.repeatMode === PlayType.single,
        html5: true,
        preload: 'metadata',
        format: ['webm', 'flac', 'mp3']
      })
      this.initListeners()
    } else {
      this.currentHowl.changeSrc(hackOption)
    }
  }

  /** 获取完整播放信息 */
  get state (): PlayerState {
    return {
      howl: this.currentHowl,
      id: this._playlist[this._index]?.id ?? 0,
      status: this.status,
      repeatMode: this.repeatMode,
      volume: this.volume,
      mute: this.mute,
      duration: this.duration,
      progress: this.progress
    }
  }

  private readonly mediaSessionInstance: MediaSessionInstance

  /** 初始化 */
  constructor (playlist: SongData[], index: number = 0, repeatMode = PlayType.loop, volume: number = 100, mute: boolean = false) {
    this.setPlaylist(playlist, index)
    this.setRepeatMode(repeatMode)
    this.setVolume(volume)
    this.setMute(mute)
    this.mediaSessionInstance = new MediaSessionInstance({
      next: () => { this.next() },
      pause: () => { this.pause() },
      play: () => { this.play() },
      prev: () => { this.prev() },
      seekTo: (seekTime?: number) => { this.seekTo(seekTime) },
      stop: () => { this.stop() }
    })
  }

  /** 重置播放器实例 */
  public reset (): void {
    this.cleanHowl()
    this._playlist = []
    this._index = 0
    this._status = 'none'
    this._duration = 0
    this._progress = 0
    this.emit(PlayerEvent.RESET, this)
    this.mediaSessionInstance.reset()
  }

  /** 设置歌曲列表 */
  public setPlaylist (playlist: SongData[], index: number = 0, autoplay: boolean = false) {
    if (playlist.length === 0) {
      return
    }
    this.reset()
    this.playlist = playlist.map(item => {
      return {
        id: item.id,
        name: item.name,
        artists: item.artists,
        album: item.album,
        howl: null,
        hiresUrl: item.hiresUrl ?? '',
        url: item.url ?? '',
        time: item.time ?? 0,
        timestamp: 0
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

  /** 切换曲目（索引） core功能 */
  public async setIndex (index: number, autoplay: boolean) {
    if (this._index === index || this._playlist[index] == null) return

    // 防抖索引，多次切换歌曲但歌曲初始化未完成，将跳过howl的init
    this.autoplay = autoplay
    this.index = index

    const curPlaylist = this._playlist[index]
    const curPlayId = curPlaylist.id

    try {
      const urlExpire = curPlaylist.timestamp != null && Date.now() - curPlaylist.timestamp > Player.urlExpiration
      const hiresUrlInvalid = curPlaylist.hiresUrl == null || curPlaylist.hiresUrl?.length === 0
      const standardUrlInvalid = curPlaylist.url == null || curPlaylist.url?.length === 0
      const songOption: SongOption = {
        duration: 0,
        hires: '',
        standard: ''
      }

      if (urlExpire || (hiresUrlInvalid && standardUrlInvalid)) {
        let hiresPass = false
        let standardPass = false

        const [hiResSong, normalSong] = await Promise.allSettled([
          getHiResSongUrl(curPlayId).then(res => res.data),
          getSongUrl(curPlayId).then(res => res.data[0])
        ])

        if (hiResSong.status === 'fulfilled' && hiResSong.value.url?.length > 0) {
          hiresPass = true
          songOption.duration = hiResSong.value.time
          songOption.hires = hiResSong.value.url
        }

        if (normalSong.status === 'fulfilled' && normalSong.value.url?.length > 0) {
          standardPass = true
          songOption.duration = normalSong.value.time
          songOption.standard = normalSong.value.url
        }

        if (!hiresPass && !standardPass) {
          throw new Error(`INVALID AUDIO ID: ${curPlayId}`)
        }

        curPlaylist.timestamp = Date.now()
        curPlaylist.time = songOption.duration
        curPlaylist.hiresUrl = songOption.hires
        curPlaylist.url = songOption.standard
      } else {
        songOption.duration = Number(curPlaylist.time)
        songOption.hires = String(curPlaylist.hiresUrl)
        songOption.standard = String(curPlaylist.url)
      }

      // debounce
      if (this.index === index) {
        this.changeSong(songOption)
      }
    } catch (error) {
      this.cleanHowl()
      this.playInvalid(error)
    }

    this.mediaSessionInstance.updateMetadata({
      title: curPlaylist.name,
      artist: curPlaylist.artists.map(a => a.name).join(' / '),
      album: curPlaylist.album.name,
      artwork: [{ src: `${formatImgUrl(curPlaylist.album.picUrl ?? '', 128)}`, sizes: '128x128' }]
    })
  }

  /** 步进进度 */
  public step () {
    if (this.currentHowl == null) return
    const duration = this.currentHowl.duration()
    const seekTime = this.currentHowl.seek()

    const progressTime = seekTime > 0 ? seekTime : 0
    const progress = duration > 0 ? (progressTime / duration) * 100 : 0

    this.progress = Math.max(0, Math.min(100, progress))

    this.mediaSessionInstance.updateProgress({
      duration,
      position: seekTime
    })
  }

  private requestId: number = 0
  /** 播放进度更新 */
  public update () {
    this.step()
    if (this.currentHowl == null) return
    window.clearTimeout(this.requestId)
    if (this.currentHowl.playing() || this.status === 'playing') {
      this.requestId = window.setTimeout(() => { this.update() }, 300)
    }
  }

  /** play 监听回调 */
  private readonly onPlay = () => {
    this.status = 'playing'
    this.update()
    this.emit(PlayerEvent.PLAY, this.state)
    this.mediaSessionInstance.updateStatus(this.status)
  }

  /** pause 监听回调 */
  private readonly onPause = () => {
    this.status = 'paused'
    this.emit(PlayerEvent.PAUSE, this.state)
    this.mediaSessionInstance.updateStatus(this.status)
  }

  /** stop 监听回调 */
  private readonly onStop = () => {
    this.status = 'none'
    this.emit(PlayerEvent.STOP, this.state)
    this.mediaSessionInstance.updateStatus(this.status)
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
        if (this._index < this._playlist.length - 1) {
          this.next()
        }
        break

      default:
        break
    }
    this.emit(PlayerEvent.END, this.state)
    this.mediaSessionInstance.updateStatus(this.status)
  }

  /** seek 监听回调 */
  private readonly onSeek = () => {
    this.emit(PlayerEvent.SEEK, this.state)
  }

  // todo shuffle
  private randomIndex (): number {
    let random: number
    do {
      random = Math.floor(Math.random() * this._playlist.length)
    } while (random === this._index)
    return random
  }

  private nextIndex (): number {
    return this._index < this._playlist.length - 1 ? this._index + 1 : 0
  }

  private prevIndex (): number {
    return this._index > 0 ? this._index - 1 : this._playlist.length - 1
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

  private playInvalid (msg?: unknown) {
    console.warn('INVALID AUDIO' + String(msg))
    this._progress = 0
    this._status = 'none'
    this.emit(PlayerEvent.PROGRESS_CHANGE, 0)
    this.emit(PlayerEvent.INVALID, this.state)
  }

  /** 播放 */
  public play () {
    if (this._playlist.length === 0) return
    if (this.currentHowl == null) {
      this.playInvalid()
      return
    }
    if (this.currentHowl.playing()) return
    this.currentHowl.play()
    this.currentHowl.fade(0, this._volume, 500)
  }

  /** 停止 */
  public stop (): void {
    if (this.currentHowl == null) return
    this.currentHowl.stop()
  }

  /** 暂停 */
  public pause (): void {
    if (this.currentHowl == null) return
    this.currentHowl.pause()
  }

  /** 播放/暂停切换 */
  public switchPlay (): void {
    if (this.currentHowl == null) return
    if (this.currentHowl.playing()) {
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
    if (this.currentHowl != null) {
      this.currentHowl.seek(seekTime)
    }
  }

  /**
   * @description 跳转进度
   * @param progress 0-100
   */
  public progressTo (progress: number) {
    let duration = 0
    if (this.currentHowl != null) {
      duration = this.currentHowl.duration() > 0 ? this.currentHowl.duration() : this.duration
    } else {
      duration = this.duration
    }
    const seekTime = Math.max(0, Math.min(100, progress)) / 100 * duration
    this.seekTo(seekTime)
  }

  /** 设置循环模式 */
  public setRepeatMode (mode: PlayType): void {
    this.repeatMode = mode
    if (this.currentHowl != null) {
      this.currentHowl.loop(mode === PlayType.single)
    }
  }

  /**
   * @description 设置音量
   * @param volume 0-100
   */
  public setVolume (volume: number): void {
    const newVolume = Math.max(0, Math.min(100, volume))
    this.volume = newVolume

    const percent = newVolume / 100
    Howler.volume(percent)
    this.currentHowl?.volume(percent)
  }

  /** 设置静音 */
  public setMute (mute: boolean): void {
    this.mute = mute
    Howler.mute(mute)
    this.currentHowl?.mute(mute)
  }

  /** 播放实例初始化 */
  public init (state: InitState) {
    this.setVolume(state.volume)
    this.setMute(state.mute)
    this.setRepeatMode(state.repeatMode)
    this.setPlaylist(state.playlist, state.index)
  }
}

export const playerInstance = new Player([])
