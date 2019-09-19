const r = require('raylib')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

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
    this.screen.ClearBackground(r.BLACK)

    this.soundEnabled = false
    this.keys = 0
    this.resolveKey = null

    // this.screen.IsKeyPressed(key => {
    //   this.mapKey(key)
    // })
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
    this.screen.ClearBackground(r.BLACK)
  }

  drawPixel(x, y, value) {
    r.BeginDrawing()

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
        r.GREEN
      )
    } else {
      this.screen.DrawRectangleRec(
        {
          x: x * this.multiplier,
          y: y * this.multiplier,
          width: this.multiplier,
          height: this.multiplier,
        },
        r.BLACK
      )
    }

    r.EndDrawing()

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
