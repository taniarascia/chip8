const { CpuInterface } = require('./CpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH, COLOR } = require('../../data/constants')
const keyMap = require('../../data/keyMap')

/**
 * WebCpuInterface
 *
 * A CPU interface for the web using DOM events and HTML5 canvas.
 */
class WebCpuInterface extends CpuInterface {
  constructor() {
    super()

    // Screen
    this.frameBuffer = this._createFrameBuffer()
    this.screen = document.querySelector('canvas')
    this.multiplier = 10
    this.screen.width = DISPLAY_WIDTH * this.multiplier
    this.screen.height = DISPLAY_HEIGHT * this.multiplier
    this.context = this.screen.getContext('2d')
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.screen.width, this.screen.height)

    // Keys
    this.keys = 0
    this.keyPressed = undefined

    // Sound
    this.soundEnabled = false

    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      this.audioContext = new (AudioContext || webkitAudioContext)()

      this.masterGain = new GainNode(this.audioContext)
      this.masterGain.gain.value = 0.3
      this.masterGain.connect(this.audioContext.destination)

      let soundEnabled = false
      let oscillator
      Object.defineProperties(this, {
        soundEnabled: {
          get: function() { return soundEnabled },
          set: function(value) {
            value = Boolean(value)
            if (value !== soundEnabled) {
              soundEnabled = value
              if (soundEnabled) {
                oscillator = new OscillatorNode(this.audioContext, {
                  type: 'square'
                })
                oscillator.connect(this.masterGain)
                oscillator.start()
              } else {
                oscillator.stop()
              }
            }
          }
        }
      })

      // Interface for muting sound
      const muteInstructions = document.createElement('pre')
      muteInstructions.classList.add('instructions')
      muteInstructions.innerText = 'M = toggle sound '

      const muteIcon = document.createElement('span')
      muteIcon.innerText = '🔊'

      muteInstructions.append(muteIcon)
      document
        .querySelector('.instructions')
        .insertAdjacentElement('afterend', muteInstructions)

      let muted = false
      document.addEventListener('keydown', event => {
        if (event.key.toLowerCase() === 'm') {
          muted = !muted
          muteIcon.innerText = muted ? '🔇' : '🔊'
          this.masterGain.gain.value = muted ? 0 : 0.3
        }
      })
    }

    // =========================================================================
    // Key Down Event
    // =========================================================================

    document.addEventListener('keydown', event => {
      const keyIndex = keyMap.indexOf(event.key)

      if (keyIndex > -1) {
        this._setKeys(keyIndex)
      }
    })

    // =========================================================================
    // Key Up Event
    // =========================================================================

    document.addEventListener('keyup', event => {
      this._resetKeys()
    })
  }

  _createFrameBuffer() {
    let frameBuffer = []

    for (let i = 0; i < DISPLAY_WIDTH; i++) {
      frameBuffer.push([])
      for (let j = 0; j < DISPLAY_HEIGHT; j++) {
        frameBuffer[i].push(0)
      }
    }

    return frameBuffer
  }

  _setKeys(keyIndex) {
    let keyMask = 1 << keyIndex

    this.keys = this.keys | keyMask
    this.keyPressed = keyIndex
  }

  _resetKeys() {
    this.keys = 0
    this.keyPressed = undefined
  }

  waitKey() {
    // Get and reset key
    const keyPressed = this.keyPressed
    this.keyPressed = undefined

    return keyPressed
  }

  getKeys() {
    return this.keys
  }

  drawPixel(x, y, value) {
    // If collision, will return true
    const collision = this.frameBuffer[y][x] & value
    // Will XOR value to position x, y
    this.frameBuffer[y][x] ^= value

    if (this.frameBuffer[y][x]) {
      this.context.fillStyle = COLOR
      this.context.fillRect(
        x * this.multiplier,
        y * this.multiplier,
        this.multiplier,
        this.multiplier
      )
    } else {
      this.context.fillStyle = 'black'
      this.context.fillRect(
        x * this.multiplier,
        y * this.multiplier,
        this.multiplier,
        this.multiplier
      )
    }

    return collision
  }

  clearDisplay() {
    this.frameBuffer = this._createFrameBuffer()
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.screen.width, this.screen.height)
  }

  enableSound() {
    this.soundEnabled = true
  }

  disableSound() {
    this.soundEnabled = false
  }
}

module.exports = {
  WebCpuInterface,
}
