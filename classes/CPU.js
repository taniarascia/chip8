const { Disassembler } = require('./Disassembler')
const { FONT_SET } = require('../constants/fontSet')
const DISPLAY_WIDTH = 64
const DISPLAY_HEIGHT = 32

class CPU {
  constructor(cpuInterface) {
    this.interface = cpuInterface
  }
  /**
   * Set or reset the state to initial values.
   *
   * Memory - 4kb (4096 bytes) memory storage (8-bit)
   * Registers (16 * 8-bit) V0 through VF; VF is a flag
   * Stack (16 * 16-bit)
   * I - stores memory addresses
   * ST - Sound Timer (8-bit)
   * DT - Delay Timer (8-bit)
   * PC - Program Counter (8-bit) stores currently executing address
   * SP - Stack Pointer (8-bit) points at topost level of stack
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
    this.halted = false
    this.soundEnabled = false
  }

  load(romBuffer) {
    this.reset()

    // 0-80 in memory is reserved for font set
    for (let i = 0; i < FONT_SET.length; i++) {
      this.memory[i] = FONT_SET[i]
    }

    const romData = romBuffer.data
    let memoryStart = 0x200

    // Place ROM data in memory starting at 0x200
    for (let i = 0; i < romData.length; i++) {
      this.memory[memoryStart + 2 * i] = romData[i] >> 8
      this.memory[memoryStart + 2 * i + 1] = romData[i] & 0x00ff
    }
  }

  tick() {
    if (this.DT > 0) {
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

  step() {
    if (this.halted) {
      throw new Error(
        'A problem has been detected and Chip-8 has been shut down to prevent damage to your computer.'
      )
    }
    const opcode = this._fetch()
    const instruction = this._decode(opcode)

    console.log(
      'PC: ' + this.PC.toString(16).padStart(4, '0') + ' ' + Disassembler.format(instruction),
      opcode.toString(16).padStart(4, '0'),
      instruction.instruction.id
    )

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

    return (this.memory[this.PC] << 8) | (this.memory[this.PC + 1] << 0)
  }

  _decode(opcode) {
    return Disassembler.disassemble(opcode)
  }

  _execute(instruction) {
    const id = instruction.instruction.id
    const args = instruction.args

    switch (id) {
      case 'CLS':
        // Clear the display
        this.interface.clearDisplay()
        this._nextInstruction()
        break
      case 'RET':
        // Return from a subroutine.
        if (this.SP === -1) {
          this.halted = true
          throw new Error('Stack underflow.')
        }

        this.PC = this.stack[this.SP]
        this.SP--
        break
      case 'JP_ADDR':
        // Jump to location nnn.
        this.PC = args[0]
        break
      case 'CALL_ADDR':
        // Call subroutine at nnn.
        if (this.SP === 15) {
          this.halted = true
          throw new Error('Stack overflow.')
        }

        this.SP++
        this.stack[this.SP] = this.PC + 2
        this.PC = args[0]
        break
      case 'SE_VX_NN':
        // Skip next instruction if Vx = kk.
        if (this.registers[args[0]] === args[1]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break
      case 'SNE_VX_NN':
        // Skip next instruction if Vx != kk.
        if (this.registers[args[0]] !== args[1]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break
      case 'SE_VX_VY':
        // Skip next instruction if Vx = Vy.
        if (this.registers[args[0]] === this.registers[args[1]]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break
      case 'LD_VX_NN':
        // Set Vx = kk.
        this.registers[args[0]] = args[1]
        this._nextInstruction()
        break
      case 'ADD_VX_NN':
        // Set Vx = Vx + kk.
        this.registers[args[0]] = this.registers[args[0]] + args[1]
        this._nextInstruction()
        break
      case 'LD_VX_VY':
        // Set Vx = Vy.
        this.registers[args[0]] = this.registers[args[1]]
        this._nextInstruction()
        break
      case 'OR_VX_VY':
        // Set Vx = Vx OR Vy.
        this.registers[args[0]] |= this.registers[args[1]]
        this._nextInstruction()
        break
      case 'AND_VX_VY':
        // Set Vx = Vx AND Vy.
        this.registers[args[0]] &= this.registers[args[1]]
        this._nextInstruction()
        break
      case 'XOR_VX_VY':
        // Set Vx = Vx XOR Vy.
        this.registers[args[0]] ^= this.registers[args[1]]
        this._nextInstruction()
        break
      case 'ADD_VX_VY':
        // Set Vx = Vx + Vy, set VF = carry.
        this.registers[0xf] = this.registers[args[0]] + this.registers[args[1]] > 0xff ? 1 : 0

        this.registers[args[0]] = this.registers[args[0]] + this.registers[args[1]]
        this._nextInstruction()
        break
      case 'SUB_VX_VY':
        // Set Vx = Vx - Vy, set VF = NOT borrow.
        this.registers[0xf] = this.registers[args[0]] > this.registers[args[1]] ? 1 : 0

        this.registers[args[0]] = this.registers[args[0]] - this.registers[args[1]]
        this._nextInstruction()
        break
      case 'SHR_VX_VY':
        // Set Vx = Vx SHR 1.
        this.registers[0xf] = this.registers[args[0]] & 1
        this.registers[args[0]] >>= 1
        this._nextInstruction()
        break
      case 'SUBN_VX_VY':
        // Set Vx = Vy - Vx, set VF = NOT borrow.
        this.registers[0xf] = this.registers[args[1]] > this.registers[args[0]] ? 1 : 0

        this.registers[args[0]] = this.registers[args[1]] - this.registers[args[0]]
        this._nextInstruction()
        break
      case 'SHL_VX_VY':
        // Set Vx = Vx SHL 1.
        this.registers[0xf] = this.registers[args[0]] >> 7

        this.registers[args[0]] = this.registers[args[0]] << 1
        this._nextInstruction()
        break
      case 'SNE_VX_VY':
        // Skip next instruction if Vx != Vy.
        if (this.registers[args[0]] !== this.registers[args[1]]) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break
      case 'LD_I_ADDR':
        // Set I = nnn.
        this.I = args[1]
        this._nextInstruction()
        break
      case 'JP_V0_ADDR':
        // Jump to location nnn + V0.
        this.PC = this.registers[0] + args[1]
        break
      case 'RND_VX_NN':
        // Set Vx = random byte AND kk.
        let random = Math.floor(Math.random() * 256)
        this.registers[args[0]] = random & args[1]
        this._nextInstruction()
        break
      case 'DRW_VX_VY_N':
        // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
        // The interpreter reads n bytes from memory, starting at the address stored in I.
        if (this.I > 4095 - args[2]) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        this.registers[0xf] = 0

        // The interpreter reads n bytes from memory, starting at the address stored in I.
        for (let i = 0; i < args[2]; i++) {
          let line = this.memory[this.I + i]
          // Each byte is a line of eight pixels
          for (let position = 0; position < 8; position++) {
            // Get the byte to set by position
            let value = line & (1 << (7 - position)) ? 1 : 0
            // If this causes any pixels to be erased, VF is set to 1, otherwise it is set to 0.
            let x = (this.registers[args[0]] + position) % DISPLAY_WIDTH
            let y = (this.registers[args[1]] + i) % DISPLAY_HEIGHT
            if (this.interface.drawPixel(x, y, value)) {
              this.registers[0xf] = 1
            }
          }
        }

        this._nextInstruction()
        break
      case 'SKP_VX':
        // Skip next instruction if key with the value of Vx is pressed.
        if (this.interface.getKeys() & (1 << this.registers[args[0]])) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break
      case 'SKNP_VX':
        // Skip next instruction if key with the value of Vx is not pressed.
        if (!(this.interface.getKeys() & (1 << this.registers[args[0]]))) {
          this._skipInstruction()
        } else {
          this._nextInstruction()
        }
        break
      case 'LD_VX_DT':
        // Set Vx = delay timer value.
        this.registers[args[0]] = this.DT
        this._nextInstruction()
        break
      case 'LD_VX_K':
        // Wait for a key press, store the value of the key in Vx.
        this.registers[args[0]] = this.interface.waitKey()
        this._nextInstruction()
        break
      case 'LD_DT_VX':
        // Set delay timer = Vx.
        this.DT = this.registers[args[1]]
        this._nextInstruction()
        break
      case 'LD_ST_VX':
        // Set sound timer = Vx.
        this.ST = this.registers[args[1]]
        if (this.ST > 0) {
          this.soundEnabled = true
          this.interface.enableSound()
        }
        this._nextInstruction()
        break
      case 'ADD_I_VX':
        // Set I = I + Vx.
        this.I = this.I + this.registers[args[1]]
        this._nextInstruction()
        break
      case 'LD_F_VX':
        // Set I = location of sprite for digit Vx.
        if (this.registers[args[1]] > 0xf) {
          this.halted = true
          throw new Error('Invalid digit.')
        }

        this.I = this.registers[args[1]] * 5
        this._nextInstruction()
        break
      case 'LD_B_VX':
        // Store BCD representation of Vx in memory locations I, I+1, and I+2.
        if (this.I > 4093) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        let x = this.registers[args[1]]
        const a = Math.floor(x / 100)
        x = x - a * 100
        const b = Math.floor(x / 10)
        x = x - b * 10
        const c = Math.floor(x)

        this.memory[this.I] = a
        this.memory[this.I + 1] = b
        this.memory[this.I + 2] = c

        this._nextInstruction()
        break
      case 'LD_I_VX':
        // Store registers V0 through Vx in memory starting at location I.
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
        // Read registers V0 through Vx from memory starting at location I.
        if (this.I > 4095 - args[0]) {
          this.halted = true
          throw new Error('Memory out of bounds.')
        }

        for (let i = 0; i <= args[1]; i++) {
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
