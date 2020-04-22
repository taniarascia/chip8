const blessed = require('blessed')

const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH, COLOR } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

/**
 * TerminalCpuInterface
 *
 * A CPU interface with the terminal.
 */
class TerminalCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.blessed = blessed

    // Screen
    this.frameBuffer = this._createFrameBuffer()
    this.screen = blessed.screen({ smartCSR: true })
    this.screen.title = 'Chip8.js'
    this.color = blessed.helpers.attrToBinary({ fg: COLOR })

    // Keys
    this.keys = 0
    this.keyPressed = undefined

    // Sound
    this.soundEnabled = false

    // Exit game
    this.screen.key(['escape', 'C-c'], () => {
      process.exit(0)
    })

    // =========================================================================
    // Key Down Event
    // =========================================================================

    this.screen.on('keypress', (_, key) => {
      const keyIndex = keyMap.indexOf(key.full)

      if (keyIndex > -1) {
        this._setKeys(keyIndex)
      }
    })

    // =========================================================================
    // Key Up Event
    // =========================================================================

    setInterval(() => {
      // Emulate a keyup event to clear all pressed keys
      this._resetKeys()
    }, 100)
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
      this.screen.fillRegion(this.color, '█', x, x + 1, y, y + 1)
    } else {
      this.screen.clearRegion(x, x + 1, y, y + 1)
    }

    this.screen.render()

    return collision
  }

  clearDisplay() {
    this.frameBuffer = this._createFrameBuffer()
    this.screen.clearRegion(0, DISPLAY_WIDTH, 0, DISPLAY_HEIGHT)
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = {
  TerminalCpuInterface,
}
