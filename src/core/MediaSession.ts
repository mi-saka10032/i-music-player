interface HandlerMap {
  next: () => void
  pause: () => void
  play: () => void
  prev: () => void
  seekTo: (seekTime?: number) => void
  stop: () => void
}

export default class MediaSessionInstance {
  static hasMediaSession = 'mediaSession' in window.navigator

  constructor (handlerMap: HandlerMap) {
    if (MediaSessionInstance.hasMediaSession) {
      const mediaSession = window.navigator.mediaSession
      mediaSession.setActionHandler('nexttrack', () => {
        handlerMap.next()
      })
      mediaSession.setActionHandler('pause', () => {
        handlerMap.pause()
      })
      mediaSession.setActionHandler('play', () => {
        handlerMap.play()
      })
      mediaSession.setActionHandler('previoustrack', () => {
        handlerMap.prev()
      })
      mediaSession.setActionHandler('seekto', details => {
        handlerMap.seekTo(details.seekTime)
      })
      mediaSession.setActionHandler('stop', () => {
        handlerMap.stop()
      })
    }
  }

  public updateMetadata (metadata: MediaMetadataInit) {
    if (MediaSessionInstance.hasMediaSession) {
      window.navigator.mediaSession.metadata = new window.MediaMetadata(metadata)
    }
  }

  public updateProgress (state: MediaPositionState) {
    if (MediaSessionInstance.hasMediaSession) {
      window.navigator.mediaSession.setPositionState(state)
    }
  }

  public updateStatus (status: MediaSessionPlaybackState) {
    if (MediaSessionInstance.hasMediaSession) {
      window.navigator.mediaSession.playbackState = status
    }
  }

  public reset () {
    if (MediaSessionInstance.hasMediaSession) {
      window.navigator.mediaSession.playbackState = 'none'
      window.navigator.mediaSession.metadata = null
    }
  }
}
