const blessed = require('blessed')
const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

class TerminalCpuInterface extends CpuInterface {
  constructor() {
    super()

    this.blessed = blessed
    this.screen = blessed.screen({ smartCSR: true })
    this.screen.title = 'Chip8.js'

    this.screenRepresentation = []
    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      this.screenRepresentation.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        this.screenRepresentation[i].push(0)
      }
    }

    this.soundEnabled = false
    this.keys = null
    this.resolveKey = null

    this.screen.key(['escape', 'C-c'], () => {
      process.exit(0)
    })

    this.screen.on('keypress', (_, key) => {
      this.mapKey(key)
    })

    // Hack a keyup event
    setInterval(() => {
      this.keys = 0
    }, 50)
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

  clearDisplay() {
    this.screenRepresentation = []
    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      this.screenRepresentation.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        this.screenRepresentation[i].push(0)
      }
    }
    this.screen.clearRegion(0, DISPLAY_WIDTH, 0, DISPLAY_HEIGHT)
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.screenRepresentation[y][x] & value
    // Will XOR value to position x, y
    this.screenRepresentation[y][x] ^= value

    if (this.screenRepresentation[y][x]) {
      this.screen.fillRegion(blessed.helpers.attrToBinary({ fg: 'green' }), '█', x, x + 1, y, y + 1)
    } else {
      this.screen.clearRegion(x, x + 1, y, y + 1)
    }

    this.screen.render()

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
    // sound enabled
  }

  disableSound() {
    // sound disabled
  }
}

module.exports = {
  TerminalCpuInterface,
}
