const blessed = require('blessed')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')

class TerminalCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.blessed = blessed
    this.screen = blessed.screen()

    this.screen.title = 'Chip8.js'

    this.display = this.blessed.box(this.createDisplay())

    this.screenRepresentation = []
    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      this.screenRepresentation.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        this.screenRepresentation[i].push(0)
      }
    }

    this.soundEnabled = false
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

  clearDisplay() {
    this.display.detach()
    this.display = this.blessed.box(this.createDisplay())
  }

  waitKey() {}

  getKeys() {}

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.screenRepresentation[y][x] & value
    // Will XOR value to position x, y
    this.screenRepresentation[y][x] ^= value

    this.blessed.box({
      parent: this.display,
      top: x,
      left: y,
      width: this.screenRepresentation[y][x],
      height: this.screenRepresentation[y][x],
      style: {
        fg: 'green',
        bg: 'green',
      },
    })

    this.screen.render()

    return collision
  }

  showDisplay() {}

  enableSound() {}

  disableSound() {}
}

module.exports = {
  TerminalCpuInterface,
}
