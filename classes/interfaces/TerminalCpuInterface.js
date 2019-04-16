const blessed = require('blessed')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

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

    this.soundEnabled = false
    this.currentKey = null
    this.keys = null

    this.screen.key(['escape', 'C-c'], () => {
      process.exit(0)
    })

    this.screen.on('keypress', this.mapKey)
  }

  mapKey(_, key) {
    let keyMask

    if (keyMap.includes(key.full)) {
      keyMask = 1 << keyMap.indexOf(key.full)

      this.keys = this.keys | keyMask
      this.currentKey = keyMap.indexOf(key.full)
    }
  }

  createDisplay() {
    return {
      parent: this.screen,
      top: 'center',
      left: 'center',
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

  waitKey() {
    return new Promise(resolve => {
      // need to figure this generator out, probably
      resolve(this.currentKey)
    })
  }

  getKeys() {
    return this.keys
  }

  enableSound() {
    // sound enabled
  }

  disableSound() {
    // sound disabled
  }
}

module.exports = {
  TerminalCpuInterface,
}
