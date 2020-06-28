import { SOUND_ON } from './constants.js'

class Sound {
  constructor(src, vol = 1.0, maxStreams = 1) {
    this.streamNum = 0
    this.streams = []
    this.maxStreams = maxStreams
    for (let i = 0; i < this.maxStreams; i++) {
      this.streams.push(new Audio(src))
      this.streams[i].volume = vol
    }
  }

  play() {
    if (!SOUND_ON) return
    this.streamNum = (this.streamNum + 1) % this.maxStreams
    this.streams[this.streamNum].play()
  }

  stop() {
    this.streams[this.streamNum].pause()
    this.streams[this.streamNum].currentTime = 0
  }

}

export const explodeFX = new Sound('../audio/explode.m4a', 1.0, 1)
export const hitFX = new Sound('../audio/hit.m4a', 1.0, 10)
export const laserFX = new Sound('../audio/laser.m4a', 0.1, 10)
export const thrustFX = new Sound('../audio/thrust.m4a', 0.5, 1)
