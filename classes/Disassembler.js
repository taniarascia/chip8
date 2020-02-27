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
