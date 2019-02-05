const { CpuInterface } = require('./CpuInterface')

class MockCpuInterface extends CpuInterface {
  // Temporary derived class
  constructor() {
    super()
    // Temporary 8x5 display
    this.display = [
      [ 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    ]
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
    return 0
  }

  getKeys() {
    // Will return bitmask of all keys set
    return 0b0000000000011101 // 0, 2, 3, 4 example
  }

  drawPixel(x, y, value) {
    // Will XOR value to position x, y
    // If collision, will return true
    this.display[x][y] ^= value

    return this.display[x][y] ^ value // collision
  }

  enableSound() {
    console.log('sound is enabled')
  }

  disableSound() {
    console.log('sound is disabled')
  }
}

module.exports = {
  MockCpuInterface,
}
