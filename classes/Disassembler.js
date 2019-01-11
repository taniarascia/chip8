const { INSTRUCTION_SET } = require('../constants/instructionSet')

class Disassembler {
  static disassemble(opcode) {
    const instruction = INSTRUCTION_SET.filter(
      instruction => (opcode & instruction.mask) === instruction.pattern
    )[0]
    const args = instruction.arguments.map(arg => (opcode & arg.mask) >> arg.shift)

    return { instruction, args }
  }

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
  static format(decodedInstruction) {
    const types = decodedInstruction.instruction.arguments.map(arg => arg.type)
    const rawArgs = decodedInstruction.args
    let formatted

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
      formatted = decodedInstruction.instruction.name + ' ' + args.join(', ')
    } else {
      formatted = decodedIntruction.instruction.name
    }

    return formatted
  }

  static dump(data) {
    const lines = data.map((code, i) => {
      const address = (i * 2).toString(16).padStart(6, '0')
      const opcode = code.toString(16).padStart(4, '0')
      const instruction = this.format(this.disassemble(code))

      return `${address}  ${opcode}  ${instruction}`
    })

    return lines.join('\n')
  }
}

module.exports = {
  Disassembler,
}
