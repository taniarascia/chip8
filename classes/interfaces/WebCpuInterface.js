const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH, COLOR } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

/**
 * CpuInterface
 *
 * A CPU interface for the web using DOM events and HTML5 canvas.
 */
class WebCpuInterface extends CpuInterface {
  constructor() {
    super()

    // Screen
    this.frameBuffer = this._createFrameBuffer()
    this.screen = document.querySelector('canvas')
    this.multiplier = 10
    this.screen.width = DISPLAY_WIDTH * this.multiplier
    this.screen.height = DISPLAY_HEIGHT * this.multiplier
    this.context = this.screen.getContext('2d')
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.screen.width, this.screen.height)

    // Keys
    this.keys = 0
    this.keyPressed = undefined

    // Sound
    this.soundEnabled = false

    // =========================================================================
    // Key Down Event
    // =========================================================================

    document.addEventListener('keydown', event => {
      const keyIndex = keyMap.indexOf(event.key)

      if (keyIndex) {
        this._setKeys(keyIndex)
      }
    })

    // =========================================================================
    // Key Up Event
    // =========================================================================

    document.addEventListener('keyup', event => {
      this._resetKeys()
    })
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

  _setKeys(keyIndex) {
    let keyMask = 1 << keyIndex

    this.keys = this.keys | keyMask
    this.keyPressed = keyIndex
  }

  _resetKeys() {
    this.keys = 0
    this.keyPressed = undefined
  }

  waitKey() {
    // Get and reset key
    const keyPressed = this.keyPressed
    this.keyPressed = undefined

    return keyPressed
  }

  getKeys() {
    return this.keys
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.frameBuffer[y][x] & value
    // Will XOR value to position x, y
    this.frameBuffer[y][x] ^= value

    if (this.frameBuffer[y][x]) {
      this.context.fillStyle = COLOR
      this.context.fillRect(
        x * this.multiplier,
        y * this.multiplier,
        this.multiplier,
        this.multiplier
      )
    } else {
      this.context.fillStyle = 'black'
      this.context.fillRect(
        x * this.multiplier,
        y * this.multiplier,
        this.multiplier,
        this.multiplier
      )
    }

    return collision
  }

  clearDisplay() {
    this.frameBuffer = this._createFrameBuffer()
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.screen.width, this.screen.height)
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = {
  WebCpuInterface,
}
