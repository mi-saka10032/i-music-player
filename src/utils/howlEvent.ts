import { type Howl } from 'howler'

function howlPlayCallback () {

}

export function initHowlEvent (howl: Howl) {
  howl.on('play', howlPlayCallback)
}

export function removeHowlEvent (howl: Howl) {
  howl.off('play', howlPlayCallback)
}
