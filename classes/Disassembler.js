const { INSTRUCTION_SET } = require('../constants/instructionSet')

class Disassembler {
  disassemble(opcode) {
    let instruction = INSTRUCTION_SET.filter(
      instruction => (opcode & instruction.mask) === instruction.pattern
    )[0]

    if (!instruction) {
      throw new Error('Invalid instruction')
    }

    let args = instruction.arguments.map(arg => (opcode & arg.mask) >> arg.shift)

    return { instruction, args }
  }

  format(decodedInstruction) {
    let formatted =
      decodedInstruction.args.length > 0
        ? `${decodedInstruction.instruction.name} ${decodedInstruction.args
            .map(arg => `v${arg.toString(16)}`)
            .join(', ')}`
        : decodedInstruction.instruction.name
    return formatted
  }

  dump(data) {
    let lines = []

    for (let i = 0; i < data.length; i++) {
      let address = (i * 2).toString(16).padStart(6, '0')
      let opcode = data[i].toString(16).padStart(4, '0')
      let operands = this.format(this.disassemble(data[i]))

      lines.push(`${address} ${opcode} ${operands}`)
    }

    return lines.join('\n')
  }
}

module.exports = {
  Disassembler,
}
