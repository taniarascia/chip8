const { INSTRUCTION_SET } = require('../constants/instructionSet')

class Disassembler {
  disassemble(opcode) {
    let instruction = INSTRUCTION_SET.filter(
      instruction => (opcode & instruction.mask) === instruction.pattern
    )[0]
    let args = instruction.arguments.map(arg => (opcode & arg.mask) >> arg.shift)

    return { instruction, args }
  }

  format(decodedInstruction) {
    // A = Address
    // N, NN = Constant
    // R = Register
    // K = Key
    // A = Address
    // V0 = V0
    // I, [I] = Implied
    // DT = Delay Timer
    // ST = Sount Timer
    // B = BCD
    // DW = Data Word

    let types = decodedInstruction.instruction.arguments.map(arg => arg.type)
    let rawArgs = decodedInstruction.args
    let formatted

    if (rawArgs.length > 0) {
      let args = []
      rawArgs.forEach((arg, i) => {
        if (types[i] === 'R') {
          args.push('V' + arg.toString(16))
        } else if (types[i] === 'N' || types[i] === 'A') {
          args.push('0x' + arg.toString(16))
        } else if (types[i] === 'NN') {
          args.push('0x' + arg.toString(16).padStart(2, '0'))
        } else if (
          types[i] === 'K' ||
          types[i] === 'V0' ||
          types[i] === 'I' ||
          types[i] === '[I]' ||
          types[i] === 'DT' ||
          types[i] === 'B' ||
          types[i] === 'ST'
        ) {
          args.push(types[i])
        } else {
          args.push('0x' + arg.toString(16))
        }
      })
      formatted = decodedInstruction.instruction.name + ' ' + args.join(', ')
    } else {
      formatted = decodedIntruction.instruction.name
    }

    return formatted
  }

  dump(data) {
    let lines = data.map((code, i) => {
      let address = (i * 2).toString(16).padStart(6, '0')
      let opcode = code.toString(16).padStart(4, '0')
      let operands = this.format(this.disassemble(code))

      return `${address}  ${opcode}  ${operands}`
    })

    return lines.join('\n')
  }
}

module.exports = {
  Disassembler,
}
