const r = require('raylib')

const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')

/**
 * NativeCpuInterface
 *
 * A CPU interface designed for creating a native program.
 */
class NativeCpuInterface extends CpuInterface {
  constructor() {
    super()

    // Screen
    this.frameBuffer = this._createFrameBuffer()
    this.screen = r

    // Keys
    this.keys = 0
    this.keyPressed = undefined

    // Sound
    this.soundEnabled = false
  }

  _createFrameBuffer() {
    let frameBuffer = []

    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      frameBuffer.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        frameBuffer[i].push(0)
      }
    }

    return frameBuffer
  }

  setKeys(keyIndices) {
    this.keys = keyIndices
  }

  setKey(keyIndex) {
    this.keyPressed = keyIndex
  }

  releaseKey(keyIndex) {
    this.keyPressed = this.keyPressed === keyIndex ? 0 : keyIndex
  }

  resetKeys() {
    this.keys = 0
    this.keyPressed = undefined
  }

  waitKey() {
    return this.keyPressed
  }

  getKeys() {
    return this.keys
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.frameBuffer[y][x] & value
    // Will XOR value to position x, y
    this.frameBuffer[y][x] ^= value

    return collision
  }

  clearDisplay() {
    this.frameBuffer = this._createFrameBuffer()
    this.screen.ClearBackground(this.screen.BLACK)
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
