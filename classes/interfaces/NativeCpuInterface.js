const r = require('raylib')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')
const nativeKeyMap = require('../../data/nativeKeyMap')

class NativeCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.frameBuffer = this.createFrameBuffer()
    this.screen = r
    this.soundEnabled = false
    this.keys = 0
    this.resolveKey = null
  }

  mapKey(key) {
    let keyMask

    if (nativeKeyMap.includes(key)) {
      keyMask = 1 << nativeKeyMap.indexOf(key)

      this.keys = this.keys | keyMask

      if (this.resolveKey) {
        this.resolveKey(nativeKeyMap.indexOf(key))
        this.resolveKey = null
      }
    }
  }

  createFrameBuffer() {
    let frameBuffer = []
    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      frameBuffer.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        frameBuffer[i].push(0)
      }
    }
    return frameBuffer
  }

  clearDisplay() {
    this.frameBuffer = this.createFrameBuffer()
    this.screen.ClearBackground(this.screen.BLACK)
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.frameBuffer[y][x] & value
    // Will XOR value to position x, y
    this.frameBuffer[y][x] ^= value

    return collision
  }

  waitKey() {
    return new Promise(resolve => {
      this.resolveKey = resolve
    })
  }

  getKeys() {
    return this.keys
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = {
  NativeCpuInterface,
}
