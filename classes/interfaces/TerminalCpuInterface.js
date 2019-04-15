const blessed = require('blessed')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')

class TerminalCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.blessed = blessed
    this.screen = blessed.screen()

    this.screen.title = 'Chip8.js'

    this.screenRepresentation = []
    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      this.screenRepresentation.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        this.screenRepresentation[i].push(0)
      }
    }

    this.display = this.blessed.box(this.createDisplay())

    this.keys = 0
    this.soundEnabled = false

    this.screen.on('keypress', (_, key) => {
      console.log(key)
    })

    this.screen.key(['escape', 'q', 'C-c'], () => {
      process.exit(0)
    })
  }

  createDisplay() {
    return {
      parent: this.screen,
      top: 0,
      left: 0,
      width: DISPLAY_WIDTH,
      height: DISPLAY_HEIGHT,
      style: {
        fg: 'green',
        bg: 'black',
      },
    }
  }

  renderDisplay() {
    this.clearDisplay()

    this.screenRepresentation.forEach((row, x) => {
      row.forEach((col, y) => {
        this.blessed.box({
          parent: this.display,
          top: y,
          left: x,
          width: 1,
          height: 1,
          style: {
            fg: this.screenRepresentation[y][x] ? 'green' : 'black',
            bg: this.screenRepresentation[y][x] ? 'green' : 'black',
          },
        })
      })
    })

    this.screen.render()
  }

  clearDisplay() {
    this.display.detach()
    this.display = this.blessed.box(this.createDisplay())
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.screenRepresentation[y][x] & value
    // Will XOR value to position x, y
    this.screenRepresentation[y][x] ^= value

    return collision
  }

  waitKey() {}

  getKeys() {}

  enableSound() {}

  disableSound() {}
}

module.exports = {
  TerminalCpuInterface,
}
