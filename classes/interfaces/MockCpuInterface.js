const { CpuInterface } = require('./CpuInterface')

class MockCpuInterface extends CpuInterface {
  // Temporary derived class
  constructor() {
    super()
    // Temporary 8x5 display

    this.soundEnabled = false
    this.display = []

    for (let j = 0; j < 32; j++) {
      this.display.push([])
      for (let i = 0; i < 64; i++) {
        this.display[j].push(0)
      }
    }
  }

  showDisplay() {
    // Temporary display
    let grid = '--------\n'
    this.display.forEach((row, x) => {
      row.forEach((col, y) => {
        grid += this.display[x][y]
      })
      grid += '\n'
    })
    grid += '--------\n'

    console.log(grid)
  }

  clearDisplay() {
    console.log('screen is cleared')
  }

  waitKey() {
    // Will return one key
    return 5
  }

  getKeys() {
    // Will return bitmask of all keys set
    return 0b0000000000011101 // 0, 2, 3, 4 example
  }

  drawPixel(x, y, value) {
    // Will XOR value to position x, y
    // If collision, will return true
    const collision = this.display[y][x] & value

    this.display[y][x] ^= value

    return collision
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = {
  MockCpuInterface,
}
