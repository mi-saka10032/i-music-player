interface HackOption {
  autoplay: boolean
  src: string[]
  mute: boolean
  volume: number
}

// HACK HOWL
export class HackHowl extends Howl {
  public _autoplay: boolean = false

  public _duration: number = 0

  public _sprite: object = {}

  public _src: string[] = []

  public changeSrc ({ autoplay, src, mute, volume }: HackOption) {
    this.unload()
    this._duration = 0 // init duration
    this._sprite = {} // init sprite
    this._src = src // change src
    this.load() // => update duration, sprite
    this.mute(mute)
    this.volume(volume)
    this._autoplay = autoplay
    if (autoplay) {
      this.play()
    }
  }
}
