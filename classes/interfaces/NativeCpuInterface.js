const r = require('raylib')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')
const keyMap = require('../../data/nativeKeyMap')

class NativeCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.frameBuffer = this.createFrameBuffer()
    this.multiplier = 10
    this.screen = r
    this.screenWidth = DISPLAY_WIDTH * this.multiplier
    this.screenHeight = DISPLAY_HEIGHT * this.multiplier

    this.screen.InitWindow(this.screenWidth, this.screenHeight, 'Chip8.js')
    this.screen.SetTargetFPS(60)
    this.screen.ClearBackground(this.screen.BLACK)

    this.soundEnabled = false
    this.keys = 0
    this.resolveKey = null

    // need a key event
    if (keyMap.find(key => this.screen.GetKeyPressed() === key)) {
      this.mapKey(this.screen.GetKeyPressed())
    }
  }

  keyUp() {
    this.keys = 0
  }

  mapKey(key) {
    let keyMask

    if (keyMap.includes(key.full)) {
      keyMask = 1 << keyMap.indexOf(key.full)

      this.keys = this.keys | keyMask

      if (this.resolveKey) {
        this.resolveKey(keyMap.indexOf(key.full))
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

    if (this.frameBuffer[y][x]) {
      this.screen.DrawRectangleRec(
        {
          x: x * this.multiplier,
          y: y * this.multiplier,
          width: this.multiplier,
          height: this.multiplier,
        },
        this.screen.GREEN
      )
    } else {
      this.screen.DrawRectangleRec(
        {
          x: x * this.multiplier,
          y: y * this.multiplier,
          width: this.multiplier,
          height: this.multiplier,
        },
        this.screen.BLACK
      )
    }

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
