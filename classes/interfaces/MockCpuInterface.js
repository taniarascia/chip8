const { CpuInterface } = require('./CpuInterface')

/**
 * MockCpuInterface
 *
 * A CPU interface designed for unit tests with mocked values.
 */
class MockCpuInterface extends CpuInterface {
  constructor() {
    super()

    // Screen
    this.frameBuffer = this._createFrameBuffer()

    // Keys
    this.keys = 0b0000000000011101 // 0, 2, 3, 4 example
    this.keyPressed = 5

    // Sound
    this.soundEnabled = false
  }

  _createFrameBuffer() {
    // Create a two-dimensional array of 0s for display
    // 0 represents pixel off, 1 represents pixel on
    let frameBuffer = []

    for (let i = 0; i < 32; i++) {
      frameBuffer.push([])
      for (let j = 0; j < 64; j++) {
        frameBuffer[i].push(0)
      }
    }

    return frameBuffer
  }

  waitKey() {
    // Will wait until key press and return one key
    return this.keyPressed
  }

  getKeys() {
    // Will return bitmask of all keys set
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
    return 'Screen is cleared'
  }

  // Mock display only
  renderDisplay() {
    let grid = ''
    this.frameBuffer.forEach((row, x) => {
      row.forEach((col, y) => {
        grid += this.frameBuffer[x][y]
      })
      grid += '\n'
    })
    console.log(grid)
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = { MockCpuInterface, CpuInterface }
