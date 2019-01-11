const { Disassembler } = require('./Disassembler')

class CPU {
  /**
   * Set or reset the state to initial values.
   *
   * Memory - 4kb (4096 bytes) memory storage
   * Registers (16 * 8-bit) V0 through VF; VF is a flag
   * Stack (16 * 16-bit)
   * I - stores memory addresses
   * ST - Sount Timer (8-bit)
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
    this.SP = 0
    this.PC = 0x200
  }

  load(romBuffer) {
    this.reset()

    const romData = romBuffer.data
    let memoryStart = 0x200

    for (let i = 0; i < romData.length; i++) {
      this.memory[memoryStart + 2 * i] = romData[i] >> 8
      this.memory[memoryStart + 2 * i + 1] = romData[i] & 0x00ff
    }
  }

  run() {
    while (true) {
      this.step()
    }
  }

  step() {
    const opcode = this._fetch()
    const instruction = this._decode(opcode)

    console.log(
      'PC: ' + this.PC.toString(16).padStart(4, '0') + ' ' + Disassembler.format(instruction),
      opcode.toString(16).padStart(4, '0')
    )

    this._execute(instruction)
  }

  _next() {
    this.PC = this.PC + 2
  }

  _skip() {
    this.PC = this.PC + 4
  }

  _fetch() {
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
        console.log('todo - CLS')
        this._next()
        break
      case 'RET':
        // Return from a subroutine.
        this.PC = this.stack[this.SP]
        this.SP--
        break
      case 'JP_ADDR':
        // Jump to location nnn.
        this.PC = args[0]
        break
      case 'CALL_ADDR':
        // Call subroutine at nnn.
        this.SP++
        this.stack[this.SP] = this.PC
        this.PC = args[0]
        break
      case 'SE_VX_NN':
        // Skip next instruction if Vx = kk.
        if (this.registers[args[0]] === args[1]) {
          this._skip()
        } else {
          this._next()
        }
        break
      case 'SNE_VX_NN':
        // Skip next instruction if Vx != kk.
        if (this.registers[args[0]] !== args[1]) {
          this._skip()
        } else {
          this._next()
        }
        break
      case 'SE_VX_VY':
        // Skip next instruction if Vx = Vy.
        if (this.registers[args[0]] === this.registers[args[1]]) {
          this._skip()
        } else {
          this._next()
        }
        break
      case 'LD_VX_NN':
        // Set Vx = kk.
        this.registers[args[0]] = args[1]
        this._next()
        break
      case 'ADD_VX_NN':
        // Set Vx = Vx + kk.
        this.registers[args[0]] = this.registers[args[0]] + args[1]
        this._next()
        break
      case 'LD_VX_VY':
        // Set Vx = Vy.
        this.registers[args[0]] = this.registers[args[1]]
        this._next()
        break
      case 'OR_VX_VY':
        // Set Vx = Vx OR Vy.
        this.registers[args[0]] |= this.registers[args[1]]
        this._next()
        break
      case 'AND_VX_VY':
        // Set Vx = Vx AND Vy.
        this.registers[args[0]] &= this.registers[args[1]]
        this._next()
        break
      case 'XOR_VX_VY':
        // Set Vx = Vx XOR Vy.
        this.registers[args[0]] ^= this.registers[args[1]]
        this._next()
        break
      case 'ADD_VX_VY':
        // Set Vx = Vx + Vy, set VF = carry.
        this.registers[args[0]] = this.registers[args[0]] + this.registers[args[1]]

        this.registers[0xf] = this.registers[args[0]] + this.registers[args[1]] > 0xff ? 1 : 0
        this._next()
        break
      case 'SUB_VX_VY':
        // Set Vx = Vx - Vy, set VF = NOT borrow.
        this.registers[0xf] = this.registers[args[0]] > this.registers[args[1]] ? 1 : 0

        this.registers[args[0]] = this.registers[args[0]] - this.registers[args[1]]
        this._next()
        break
      case 'SHR_VX_VY':
        // Set Vx = Vx SHR 1.
        this.registers[0xf] = this.registers[args[0]] & 1
        this.registers[args[0]] >>= 1
        this._next()
        break
      case 'SUBN_VX_VY':
        // Set Vx = Vy - Vx, set VF = NOT borrow.
        this.registers[0xf] = this.registers[args[1]] > this.registers[args[0]] ? 1 : 0

        this.registers[args[0]] = this.registers[args[1]] - this.registers[args[0]]
        this._next()
        break
      case 'SHL_VX_VY':
        // Set Vx = Vx SHL 1.
        this.registers[0xf] = this.registers[args[0]] >> 7

        this.registers[args[0]] = this.registers[args[0]] << 1
        this._next()
        break
      case 'SNE_VX_VY':
        // Skip next instruction if Vx != Vy.
        if (this.registers[args[0]] !== this.registers[args[1]]) {
          this._skip()
        } else {
          this._next()
        }
        break
      case 'LD_I_ADDR':
        // Set I = nnn.
        this.I = instruction.args[0]
        this._next()
        break
      case 'JP_V0_ADDR':
        // Jump to location nnn + V0.
        this.PC = args[0] + this.registers[0]
        break
      case 'RND_VX_NN':
        // Set Vx = random byte AND kk.
        let random = Math.floor(Math.random() * 255)
        this.registers[args[0]] = random & args[1]
        this._next()
        break
      case 'DRW_VX_VY_N':
        // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
        console.log('todo - sprite')
        this._next()
        break
      case 'SKP_VX':
        // Skip next instruction if key with the value of Vx is pressed.
        console.log('fixme 0')
        if (0 === this.registers[args[0]]) {
          this._skip()
        } else {
          this._next()
        }
        break
      case 'SKNP_VX':
        // Skip next instruction if key with the value of Vx is not pressed.
        console.log('fixme 0')
        if (0 !== this.registers[args[0]]) {
          this._skip()
        } else {
          this._next()
        }
        break
      case 'LD_VX_DT':
        // Set Vx = delay timer value.
        this.registers[args[0]] = this.DT
        this._next()
        break
      case 'LD_VX_K':
        // Wait for a key press, store the value of the key in Vx.
        console.log('fixme 0')
        this.registers[args[0]] = 0
        this._next()
        break
      case 'LD_DT_VX':
        // Set delay timer = Vx.
        this.DT = this.registers[args[1]]
        this._next()
        break
      case 'LD_ST_VX':
        // Set sound timer = Vx.
        this.ST = this.registers[args[1]]
        this._next()
        break
      case 'ADD_I_VX':
        // Set I = I + Vx.
        this.I = this.I + this.registers[args[1]]
        this._next()
        break
      case 'LD_F_VX':
        // Set I = location of sprite for digit Vx.
        console.log('todo - I = sprite Vx')
        this._next()
        break
      case 'LD_B_VX':
        // Store BCD representation of Vx in memory locations I, I+1, and I+2.
        console.log('todo - BCD')
        this._next()
        break
      case 'LD_I_VX':
        // Store registers V0 through Vx in memory starting at location I.
        for (let i = 0; i <= args[0]; i++) {
          this.memory[this.I + i] = this.registers[i]
        }
        this._next()
        break
      case 'LD_VX_I':
        // Read registers V0 through Vx from memory starting at location I.
        for (let i = 0; i <= args[0]; i++) {
          this.registers[i] = this.memory[this.I + i]
        }
        this._next()
        break
      default:
        // Data word
        console.log(args[0])
    }
  }
}

module.exports = {
  CPU,
}
