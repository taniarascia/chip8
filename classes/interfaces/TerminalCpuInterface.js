const { CpuInterface } = require('./CpuInterface')

class TerminalCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.soundEnabled = false
    this.display = []

    // Create a two-dimensional array of 0s for display
    // 0 represents pixel off, 1 represents pixel on
    for (let i = 0; i < 32; i++) {
      this.display.push([])
      for (let j = 0; j < 64; j++) {
        this.display[i].push(0)
      }
    }
  }

  showDisplay() {}

  clearDisplay() {}

  waitKey() {
    // Will wait until key press and return one key
  }

  getKeys() {
    // Will return bitmask of all keys set
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.display[y][x] & value
    // Will XOR value to position x, y
    this.display[y][x] ^= value

    return collision
  }

  enableSound() {}

  disableSound() {}
}

module.exports = {
  TerminalCpuInterface,
}
