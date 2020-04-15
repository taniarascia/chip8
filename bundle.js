(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Disassembler = require('./Disassembler')
const FONT_SET = require('../data/fontSet')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../data/constants')

/**
 * CPU
 *
 * The main Chip8.js CPU. All game related logic and instructions live within
 * the CPU. The CPU can be instantiated with an interface of choice.
 */
class CPU {
  /**
   * @param { CpuInterface } cpuInterface I/O for Chip8
   */
  constructor(cpuInterface) {
    this.interface = cpuInterface

    this.reset()
  }

  /**
   * Set or reset the state to initial values.
   *
   * Memory - 4kb (4096 bytes) memory storage (8-bit)
   * Registers - (16 * 8-bit) V0 through VF; VF is a flag
   * Stack - (16 * 16-bit)
   * ST - Sound Timer (8-bit)
   * DT - Delay Timer (8-bit)
   * I - stores memory addresses
   * SP - Stack Pointer (8-bit) points at topost level of stack
   * PC - Program Counter (8-bit) stores currently executing address
   */
  reset() {
    this.memory = new Uint8Array(4096)
    this.registers = new Uint8Array(16)
    this.stack = new Uint16Array(16)
    this.ST = 0
    this.DT = 0
    this.I = 0
    this.SP = -1
    this.PC = 0x200
    this.halted = true
    this.soundEnabled = false
  }

  load(romBuffer) {
    // Reset the CPU every time it is loaded
    this.reset()

    // 0-80 in memory is reserved for font set
    for (let i = 0; i < FONT_SET.length; i++) {
      this.memory[i] = FONT_SET[i]
    }

    // Get ROM data from ROM buffer
    const romData = romBuffer.data
    let memoryStart = 0x200

    this.halted = false

    // Place ROM data in memory starting at 0x200
    // Since memory is stored in an 8-bit array and opcodes are 16-bit, we have
    // to store the opcodes across two indices in memory
    for (let i = 0; i < romData.length; i++) {
      // set the first index with the most significant byte (i.e., 0x1234 would be 0x12)
      this.memory[memoryStart + 2 * i] = romData[i] >> 8
      // set the second index with the least significant byte (i.e., 0x1234 would be 0x34)
      this.memory[memoryStart + 2 * i + 1] = romData[i] & 0x00ff
    }
  }

  tick() {
    if (this.DT > 0) {
      // Decrement the delay timer by one until it reaches zero
      this.DT--
    }

    if (this.ST > 0) {
      // The sound timer is active whenever the sound timer register (ST) is non-zero.
      this.ST--
    } else {
      // When ST reaches zero, the sound timer deactivates.
      if (this.soundEnabled) {
        this.interface.disableSound()
        this.soundEnabled = false
      }
    }
  }

  halt() {
    this.halted = true
  }

  step() {
    if (this.halted) {
      throw new Error(
        'A problem has been detected and Chip-8 has been shut down to prevent damage to your computer.'
      )
    }

    // Fetch 16-bit opcode from memory
    const opcode = this._fetch()

    // Decode the opcode and get an object with the instruction and arguments
    const instruction = this._decode(opcode)

    // Execute code based on the instruction set
    this._execute(instruction)
  }

  _nextInstruction() {
    // Move forward two bytes
    this.PC = this.PC + 2
  }

  _skipInstruction() {
    // Move forward four bytes
    this.PC = this.PC + 4
  }

  _fetch() {
    if (this.PC > 4094) {
      this.halted = true
      throw new Error('Memory out of bounds.')
    }

    // We have to combine two bytes in memory back into one big endian opcode
    // Left shifting by eight will move one byte over two positions - 0x12 will become 0x1200
    // Left shifting by zero will keep one byte in the same position - 0x34 is still 0x34
    // OR them together and get one 16-bit opcode - 0x1200 | 0x34 returns 0x1234
    return (this.memory[this.PC] << 8) | (this.memory[this.PC + 1] << 0)
  }

  _decode(opcode) {
    // Return { instruction <object>, args <array> }
    return Disassembler.disassemble(opcode)
  }

  _execute(instruction) {
    const id = instruction.instruction.id
    const args = instruction.args

    // Execute code based on the ID of the instruction
    switch (id) {
      case 'CLS':
        // 00E0 - Clear the display
        this.interface.clearDisplay()
        this._nextInstruction()
        break

      case 'RET':
        // 00EE - Return from a subroutine
        if (this.SP === -1) {
          this.halted = true
          throw new Error('Stack underflow.')
        }

        this.PC = this.stack[this.SP]
        this.SP--
        break

      case 'JP_ADDR':
        // 1nnn - Jump to location nnn
        this.PC = args[0]
        break

      case 'CALL_ADDR':
        // 2nnn - Call subroutine at nnn
        if (this.SP === 15) {
          this.halted = true
          throw new Error('Stack overflow.')
        }

        this.SP++
        this.stack[this.SP] = this.PC + 2
        this.PC = args[0]
        break

      case 'SE_VX_NN':
        // 3xnn - Skip next instruction if Vx = nn
        if (this.registers[args[0]] === args[1]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break

      case 'SNE_VX_NN':
        // 4xnn - Skip next instruction if Vx != nn
        if (this.registers[args[0]] !== args[1]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break

      case 'SE_VX_VY':
        // 5xy0 - Skip next instruction if Vx = Vy
        if (this.registers[args[0]] === this.registers[args[1]]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break

      case 'LD_VX_NN':
        // 6xnn - Set Vx = nn
        this.registers[args[0]] = args[1]
        this._nextInstruction()
        break

      case 'ADD_VX_NN':
        // 7xnn - Set Vx = Vx + nn
        let v = this.registers[args[0]] + args[1]
        if (v > 255) {
          v -= 256
        }
        this.registers[args[0]] = v
        this._nextInstruction()
        break

      case 'LD_VX_VY':
        // 8xy0 - Set Vx = Vy
        this.registers[args[0]] = this.registers[args[1]]
        this._nextInstruction()
        break

      case 'OR_VX_VY':
        // 8xy1 - Set Vx = Vx OR Vy
        this.registers[args[0]] |= this.registers[args[1]]
        this._nextInstruction()
        break

      case 'AND_VX_VY':
        // 8xy2 - Set Vx = Vx AND Vy
        this.registers[args[0]] &= this.registers[args[1]]
        this._nextInstruction()
        break

      case 'XOR_VX_VY':
        // 8xy3 - Set Vx = Vx XOR Vy
        this.registers[args[0]] ^= this.registers[args[1]]
        this._nextInstruction()
        break

      case 'ADD_VX_VY':
        // 8xy4 - Set Vx = Vx + Vy, set VF = carry
        this.registers[args[0]] += this.registers[args[1]]
        this.registers[0xf] = this.registers[args[0]] + this.registers[args[1]] > 0xff ? 1 : 0

        this._nextInstruction()
        break

      case 'SUB_VX_VY':
        // 8xy5 - Set Vx = Vx - Vy, set VF = NOT borrow
        this.registers[0xf] = this.registers[args[0]] > this.registers[args[1]] ? 1 : 0
        this.registers[args[0]] -= this.registers[args[1]]

        this._nextInstruction()
        break

      case 'SHR_VX_VY':
        // 8xy6 - Set Vx = Vx SHR 1
        this.registers[0xf] = this.registers[args[0]] & 1
        this.registers[args[0]] >>= 1
        this._nextInstruction()
        break

      case 'SUBN_VX_VY':
        // 8xy7 - Set Vx = Vy - Vx, set VF = NOT borrow
        this.registers[0xf] = this.registers[args[1]] > this.registers[args[0]] ? 1 : 0

        this.registers[args[0]] = this.registers[args[1]] - this.registers[args[0]]
        this._nextInstruction()
        break

      case 'SHL_VX_VY':
        // 8xyE - Set Vx = Vx SHL 1
        this.registers[0xf] = this.registers[args[0]] >> 7

        this.registers[args[0]] <<= 1
        this._nextInstruction()
        break

      case 'SNE_VX_VY':
        // 9xy0 - Skip next instruction if Vx != Vy
        if (this.registers[args[0]] !== this.registers[args[1]]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break

      case 'LD_I_ADDR':
        // Annn - Set I = nnn
        this.I = args[1]
        this._nextInstruction()
        break

      case 'JP_V0_ADDR':
        // Bnnn - Jump to location nnn + V0
        this.PC = this.registers[0] + args[1]
        break

      case 'RND_VX_NN':
        // Cxnn - Set Vx = random byte AND nn
        let random = Math.floor(Math.random() * 0xff)
        this.registers[args[0]] = random & args[1]
        this._nextInstruction()
        break

      case 'DRW_VX_VY_N':
        // Dxyn - Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision
        if (this.I > 4095 - args[2]) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        // If no pixels are erased, set VF to 0
        this.registers[0xf] = 0

        // The interpreter reads n bytes from memory, starting at the address stored in I
        for (let i = 0; i < args[2]; i++) {
          let line = this.memory[this.I + i]
          // Each byte is a line of eight pixels
          for (let position = 0; position < 8; position++) {
            // Get the byte to set by position
            let value = line & (1 << (7 - position)) ? 1 : 0
            // If this causes any pixels to be erased, VF is set to 1
            let x = (this.registers[args[0]] + position) % DISPLAY_WIDTH // wrap around width
            let y = (this.registers[args[1]] + i) % DISPLAY_HEIGHT // wrap around height

            if (this.interface.drawPixel(x, y, value)) {
              this.registers[0xf] = 1
            }
          }
        }

        this._nextInstruction()
        break

      case 'SKP_VX':
        // Ex9E - Skip next instruction if key with the value of Vx is pressed
        if (this.interface.getKeys() & (1 << this.registers[args[0]])) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break

      case 'SKNP_VX':
        // ExA1 - Skip next instruction if key with the value of Vx is not pressed
        if (!(this.interface.getKeys() & (1 << this.registers[args[0]]))) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break

      case 'LD_VX_DT':
        // Fx07 - Set Vx = delay timer value
        this.registers[args[0]] = this.DT
        this._nextInstruction()
        break

      case 'LD_VX_N':
        // Fx0A - Wait for a key press, store the value of the key in Vx
        const keyPress = this.interface.waitKey()

        if (!keyPress) {
          return
        }

        this.registers[args[0]] = keyPress
        this._nextInstruction()
        break

      case 'LD_DT_VX':
        // Fx15 - Set delay timer = Vx
        this.DT = this.registers[args[1]]
        this._nextInstruction()
        break

      case 'LD_ST_VX':
        // Fx18 - Set sound timer = Vx
        this.ST = this.registers[args[1]]
        if (this.ST > 0) {
          this.soundEnabled = true
          this.interface.enableSound()
        }
        this._nextInstruction()
        break

      case 'ADD_I_VX':
        // Fx1E - Set I = I + Vx
        this.I = this.I + this.registers[args[1]]
        this._nextInstruction()
        break

      case 'LD_F_VX':
        // Fx29 - Set I = location of sprite for digit Vx
        if (this.registers[args[1]] > 0xf) {
          this.halted = true
          throw new Error('Invalid digit.')
        }

        this.I = this.registers[args[1]] * 5
        this._nextInstruction()
        break

      case 'LD_B_VX':
        // Fx33 - Store BCD representation of Vx in memory locations I, I+1, and I+2
        // BCD means binary-coded decimal
        // If VX is 0xef, or 239, we want 2, 3, and 9 in I, I+1, and I+2
        if (this.I > 4093) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        let x = this.registers[args[1]]
        const a = Math.floor(x / 100) // for 239, a is 2
        x = x - a * 100 // subtract value of a * 100 from x (200)
        const b = Math.floor(x / 10) // x is now 39, b is 3
        x = x - b * 10 // subtract value of b * 10 from x (30)
        const c = Math.floor(x) // x is now 9

        this.memory[this.I] = a
        this.memory[this.I + 1] = b
        this.memory[this.I + 2] = c

        this._nextInstruction()
        break

      case 'LD_I_VX':
        // Fx55 - Store registers V0 through Vx in memory starting at location I
        if (this.I > 4095 - args[1]) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        for (let i = 0; i <= args[1]; i++) {
          this.memory[this.I + i] = this.registers[i]
        }

        this._nextInstruction()
        break

      case 'LD_VX_I':
        // Fx65 - Read registers V0 through Vx from memory starting at location I
        if (this.I > 4095 - args[0]) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        for (let i = 0; i <= args[0]; i++) {
          this.registers[i] = this.memory[this.I + i]
        }

        this._nextInstruction()
        break

      default:
        // Data word
        this.halted = true
        throw new Error('Illegal instruction.')
    }
  }
}

module.exports = {
  CPU,
}

},{"../data/constants":6,"../data/fontSet":7,"./Disassembler":2}],2:[function(require,module,exports){
const { INSTRUCTION_SET } = require('../data/instructionSet')

/**
 * Disassembler
 *
 * Decode 16-bit (2 byte) opcodes to get instructions for the CPU.
 */
const Disassembler = {
  disassemble(opcode) {
    // Find the instruction in which the opcode & mask equals the pattern
    // For example, the opcode 0x1234 with the mask of 0xf000 applied would return 0x1000.
    // This matches the JP_ADDR mask and pattern
    const instruction = INSTRUCTION_SET.find(
      instruction => (opcode & instruction.mask) === instruction.pattern
    )

    // Each instruction may also have arguments. An argument will either be 4, 8, or 12 bits.
    // In the case of SE_VX_NN, one argument's mask is 0x0f00 and shift is 8.
    // An example opcode of 0x3abb with the mask of 0x0f00 will give us 0xa00, right shifted by 8 will give us 0xa.
    const args = instruction.arguments.map(arg => (opcode & arg.mask) >> arg.shift)

    // Return an object containing the instruction argument object and an array of arguments
    return { instruction, args }
  },

  /**
   * A - Address
   * N, NN - Constant
   * R - Register
   * K - Key
   * A - Address
   * V0 - V0
   * I, [ I ] - Implied
   * DT - Delay Timer
   * ST - Sount Timer
   * B - BCD
   * DW - Data Word
   */
  format(decodedInstruction) {
    // Print out formatted instructions from the disassembled instructions
    const types = decodedInstruction.instruction.arguments.map(arg => arg.type)
    const rawArgs = decodedInstruction.args
    let formattedInstruction

    // Format the display of arguments based on type
    if (rawArgs.length > 0) {
      let args = []

      rawArgs.forEach((arg, i) => {
        switch (types[i]) {
          case 'R':
            args.push('V' + arg.toString(16))
            break
          case 'N':
          case 'NN':
            args.push('0x' + arg.toString(16).padStart(2, '0'))
            break

          case 'K':
          case 'V0':
          case 'I':
          case '[I]':
          case 'DT':
          case 'B':
          case 'ST':
            args.push(types[i])
            break
          default:
            // DW
            args.push('0x' + arg.toString(16))
        }
      })
      formattedInstruction = decodedInstruction.instruction.name + ' ' + args.join(', ')
    } else {
      formattedInstruction = decodedInstruction.instruction.name
    }

    return formattedInstruction
  },

  // For debugging
  dump(data) {
    const lines = data.map((code, i) => {
      const address = (i * 2).toString(16).padStart(6, '0')
      const opcode = code.toString(16).padStart(4, '0')
      const instruction = this.format(this.disassemble(code))

      return `${address}  ${opcode}  ${instruction}`
    })

    return lines.join('\n')
  },
}

module.exports = Disassembler

},{"../data/instructionSet":8}],3:[function(require,module,exports){
/**
 * RomBuffer
 *
 * Produce ROM data from a raw binary.
 */
class RomBuffer {
  /**
   * @param {binary} fileContents ROM binary
   */
  constructor(fileContents) {
    this.data = []

    // Read the raw data buffer from the file
    const buffer = fileContents

    // Create 16-bit big endian opcodes from the buffer
    for (let i = 0; i < buffer.length; i += 2) {
      this.data.push((buffer[i] << 8) | (buffer[i + 1] << 0))
    }
  }

  // Hex dump for debugging
  dump() {
    let lines = []

    for (let i = 0; i < this.data.length; i += 8) {
      const address = (i * 2).toString(16).padStart(6, '0')
      const block = this.data.slice(i, i + 8)
      const hexString = block.map(value => value.toString(16).padStart(4, '0')).join(' ')

      lines.push(`${address} ${hexString}`)
    }

    return lines.join('\n')
  }
}

module.exports = {
  RomBuffer,
}

},{}],4:[function(require,module,exports){
/**
 * CpuInterface
 *
 * An abstract class that all other CPU interfaces extend from.
 */
class CpuInterface {
  constructor() {
    if (new.target === CpuInterface) {
      throw new TypeError('Cannot instantiate abstract class')
    }
  }

  // All interfaces
  clearDisplay() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  waitKey() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  getKeys() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  drawPixel() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  enableSound() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  disableSound() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  // Native interface only
  setKeys() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  resetKeys() {
    throw new TypeError('Must be implemented on the inherited class.')
  }
}

module.exports = { CpuInterface }

},{}],5:[function(require,module,exports){
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

    // =========================================================================
    // Key Down Event
    // =========================================================================

    document.addEventListener('keydown', event => {
      const keyIndex = keyMap.indexOf(event.key)

      if (keyIndex) {
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

},{"../../data/constants":6,"../../data/keyMap":9,"./CpuInterface":4}],6:[function(require,module,exports){
const DISPLAY_WIDTH = 64
const DISPLAY_HEIGHT = 32
const COLOR = '#33ff66'

module.exports = {
  DISPLAY_WIDTH,
  DISPLAY_HEIGHT,
  COLOR,
}

},{}],7:[function(require,module,exports){
const FONT_SET = [
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0,
  0x20,
  0x60,
  0x20,
  0x20,
  0x70,
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0,
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0,
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10,
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0,
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0,
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40,
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0,
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0,
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90,
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0,
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0,
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0,
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0,
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80,
]

module.exports = FONT_SET

},{}],8:[function(require,module,exports){
const INSTRUCTION_SET = [
  {
    key: 2,
    id: 'CLS',
    name: 'CLS',
    mask: 0xffff,
    pattern: 0x00e0,
    arguments: [],
  },
  {
    key: 3,
    id: 'RET',
    name: 'RET',
    mask: 0xffff,
    pattern: 0x00ee,
    arguments: [],
  },
  {
    key: 4,
    id: 'JP_ADDR',
    name: 'JP',
    mask: 0xf000,
    pattern: 0x1000,
    arguments: [{ mask: 0x0fff, shift: 0, type: 'A' }],
  },
  {
    key: 5,
    id: 'CALL_ADDR',
    name: 'CALL',
    mask: 0xf000,
    pattern: 0x2000,
    arguments: [{ mask: 0x0fff, shift: 0, type: 'A' }],
  },
  {
    key: 6,
    id: 'SE_VX_NN',
    name: 'SE',
    mask: 0xf000,
    pattern: 0x3000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00ff, shift: 0, type: 'NN' }],
  },
  {
    key: 7,
    id: 'SNE_VX_NN',
    name: 'SNE',
    mask: 0xf000,
    pattern: 0x4000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00ff, shift: 0, type: 'NN' }],
  },
  {
    key: 8,
    id: 'SE_VX_VY',
    name: 'SE',
    mask: 0xf00f,
    pattern: 0x5000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 9,
    id: 'LD_VX_NN',
    name: 'LD',
    mask: 0xf000,
    pattern: 0x6000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00ff, shift: 0, type: 'NN' }],
  },
  {
    key: 10,
    id: 'ADD_VX_NN',
    name: 'ADD',
    mask: 0xf000,
    pattern: 0x7000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00ff, shift: 0, type: 'NN' }],
  },
  {
    key: 11,
    id: 'LD_VX_VY',
    name: 'LD',
    mask: 0xf00f,
    pattern: 0x8000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 12,
    id: 'OR_VX_VY',
    name: 'OR',
    mask: 0xf00f,
    pattern: 0x8001,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 13,
    id: 'AND_VX_VY',
    name: 'AND',
    mask: 0xf00f,
    pattern: 0x8002,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 14,
    id: 'XOR_VX_VY',
    name: 'XOR',
    mask: 0xf00f,
    pattern: 0x8003,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 15,
    id: 'ADD_VX_VY',
    name: 'ADD',
    mask: 0xf00f,
    pattern: 0x8004,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 16,
    id: 'SUB_VX_VY',
    name: 'SUB',
    mask: 0xf00f,
    pattern: 0x8005,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 17,
    id: 'SHR_VX_VY',
    name: 'SHR',
    mask: 0xf00f,
    pattern: 0x8006,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 18,
    id: 'SUBN_VX_VY',
    name: 'SUBN',
    mask: 0xf00f,
    pattern: 0x8007,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 19,
    id: 'SHL_VX_VY',
    name: 'SHL',
    mask: 0xf00f,
    pattern: 0x800e,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 20,
    id: 'SNE_VX_VY',
    name: 'SNE',
    mask: 0xf00f,
    pattern: 0x9000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00f0, shift: 4, type: 'R' }],
  },
  {
    key: 21,
    id: 'LD_I_ADDR',
    name: 'LD',
    mask: 0xf000,
    pattern: 0xa000,
    arguments: [{ mask: 0x0000, shift: 0, type: 'I' }, { mask: 0x0fff, shift: 0, type: 'A' }],
  },
  {
    key: 22,
    id: 'JP_V0_ADDR',
    name: 'JP',
    mask: 0xf000,
    pattern: 0xb000,
    arguments: [{ mask: 0x0000, shift: 0, type: 'V0' }, { mask: 0x0fff, shift: 0, type: 'A' }],
  },
  {
    key: 23,
    id: 'RND_VX_NN',
    name: 'RND',
    mask: 0xf000,
    pattern: 0xc000,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00ff, shift: 0, type: 'NN' }],
  },
  {
    key: 24,
    id: 'DRW_VX_VY_N',
    name: 'DRW',
    mask: 0xf000,
    pattern: 0xd000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'R' },
      { mask: 0x00f0, shift: 4, type: 'R' },
      { mask: 0x000f, shift: 0, type: 'N' },
    ],
  },
  {
    key: 25,
    id: 'SKP_VX',
    name: 'SKP',
    mask: 0xf0ff,
    pattern: 0xe09e,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 26,
    id: 'SKNP_VX',
    name: 'SKNP',
    mask: 0xf0ff,
    pattern: 0xe0a1,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 27,
    id: 'LD_VX_DT',
    name: 'LD',
    mask: 0xf00f,
    pattern: 0xf007,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x0000, shift: 0, type: 'DT' }],
  },
  {
    key: 28,
    id: 'LD_VX_N',
    name: 'LD',
    mask: 0xf00f,
    pattern: 0xf00a,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x0000, shift: 0, type: 'K' }],
  },
  {
    key: 29,
    id: 'LD_DT_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf015,
    arguments: [{ mask: 0x0000, shift: 0, type: 'DT' }, { mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 30,
    id: 'LD_ST_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf018,
    arguments: [{ mask: 0x0000, shift: 0, type: 'ST' }, { mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 31,
    id: 'ADD_I_VX',
    name: 'ADD',
    mask: 0xf0ff,
    pattern: 0xf01e,
    arguments: [{ mask: 0x0000, shift: 0, type: 'I' }, { mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 32,
    id: 'LD_F_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf029,
    arguments: [{ mask: 0x0000, shift: 0, type: 'I' }, { mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 33,
    id: 'LD_B_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf033,
    arguments: [{ mask: 0x0000, shift: 0, type: 'B' }, { mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 34,
    id: 'LD_I_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf055,
    arguments: [{ mask: 0x0000, shift: 0, type: '[I]' }, { mask: 0x0f00, shift: 8, type: 'R' }],
  },
  {
    key: 35,
    id: 'LD_VX_I',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf065,
    arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x0000, shift: 0, type: '[I]' }],
  },
  {
    key: 36,
    id: 'DW',
    name: 'DW',
    mask: 0x0000,
    pattern: 0x0000,
    arguments: [{ mask: 0xffff, shift: 0, type: 'DW' }],
  },
]

module.exports = {
  INSTRUCTION_SET,
}

},{}],9:[function(require,module,exports){
/**
 1 2 3 4
 Q W E R
 A S D F
 Z X C V 
*/

const keyMap = ['1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v']

module.exports = keyMap

},{}],10:[function(require,module,exports){
(function (global){
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { WebCpuInterface } = require('../classes/interfaces/WebCpuInterface')

const cpuInterface = new WebCpuInterface()
const cpu = new CPU(cpuInterface)

// Set CPU and Rom Buffer to the global object, which will become window in the
// browser after bundling.
global.cpu = cpu
global.RomBuffer = RomBuffer

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/CPU":1,"../classes/RomBuffer":3,"../classes/interfaces/WebCpuInterface":5}]},{},[10]);
