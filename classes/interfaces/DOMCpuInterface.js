const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH, COLOR } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

class DOMCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.frameBuffer = this.createFrameBuffer()

    this.canvas = document.querySelector('canvas')
    this.multiplier = 10
    this.canvas.width = DISPLAY_WIDTH * this.multiplier
    this.canvas.height = DISPLAY_HEIGHT * this.multiplier

    this.context = this.canvas.getContext('2d')

    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.soundEnabled = false
    this.keys = 0
    this.keyPressed = undefined

    document.addEventListener('keydown', event => {
      this.keyPressed = this.mapKey(event.key)
    })

    document.addEventListener('keyup', event => {
      this.clearKeys()
    })
  }

  mapKey(key) {
    let keyMask
    const keyIndex = keyMap.indexOf(key)

    if (keyMap.includes(key)) {
      keyMask = 1 << keyIndex

      this.keys = this.keys | keyMask

      return keyIndex
    }
  }

  clearDisplay() {
    this.frameBuffer = this.createFrameBuffer()
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
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

  waitKey() {
    return this.keyPressed
  }

  resetKey() {
    this.keyPressed = undefined
  }

  getKeys() {
    return this.keys
  }

  clearKeys() {
    this.keys = 0
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = {
  DOMCpuInterface,
}
