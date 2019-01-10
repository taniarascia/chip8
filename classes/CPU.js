let { Disassembler } = require('./Disassembler')
// unique keys to instruction set

class CPU {
  constructor() {
    this.disassembler = new Disassembler()
    this.reset()
  }

  reset() {
    // notes:
    // VF is a flag
    // I is used to store memory addresses
    // PC stores currently executing address (program counter)
    // SP points at topost level of stack (stack pointer)
    // stack is 16 16-bit values
    this.memory = new Uint8Array(4096) // 4kb
    this.registers = new Uint8Array(16) // 0-16 registers
    this.ST = 0 // 8-bit
    this.DT = 0 // 8-bit
    this.I = 0 // 16-bit (only lowest 12-bits used)
    this.PC = 0x200 // 16-bit
  }

  load(romBuffer) {
    this.reset()

    let romData = romBuffer.data
    let memoryStart = 0x200

    for (let i = 0; i < romData.length; i++) {
      this.memory[memoryStart + 2 * i] = romData[i] >> 8
      this.memory[memoryStart + 2 * i + 1] = romData[i] & 0x00ff
    }
  }

  _fetch() {
    return (this.memory[this.PC] << 8) | (this.memory[this.PC + 1] << 0)
  }

  _decode(opcode) {
    return this.disassembler.disassemble(opcode)
  }

  _execute(instruction) {
    let name = instruction.instruction.name

    if (name === 'JP') {
      this.PC = instruction.args[0]
    } else if (name === 'LD') {
      this.I = instruction.args[0]
      this.PC = this.PC + 2
    } 
  }

  run() {
    while (true) {
      let opcode = this._fetch()
      let instruction = this._decode(opcode)
      console.log(opcode.toString(16).padStart(4, '0'))
      console.log(
        'PC: ' + this.PC.toString(16).padStart(4, '0') + ' ' + this.disassembler.format(instruction)
      )
      this._execute(instruction)
    }
  }

  test() {
    return this.memory
  }
}

module.exports = {
  CPU,
}
