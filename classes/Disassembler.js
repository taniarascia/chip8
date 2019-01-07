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
    let types = decodedInstruction.instruction.arguments.map(arg => arg.type)
    let args = decodedInstruction.args
    let argsLookup = types.map((type, i) => [ type, args[i] ]) // zip it

    argsLookup.forEach((type, i) => {
      if (type[0] === 'K' || type[0] === 'KK' || type[0] === 'KKK') {
        argsLookup[i].push(`v${type[1].toString(16)}`)
      } else {
        argsLookup[i].push(type[0] + type[1].toString(16))
      }
    })

    let formatted

    if (decodedInstruction.args.length > 0) {
      formatted =
        decodedInstruction.instruction.name + ' ' + argsLookup.map(arg => arg[2]).join(', ')
    } else {
      formatted = decodedIntruction.instruction.name
    }
    return formatted
  }

  dump(data) {
    let lines = []

    for (let i = 0; i < data.length; i++) {
      let address = (i * 2).toString(16).padStart(6, '0')
      let opcode = data[i].toString(16).padStart(4, '0')
      let operands = this.format(this.disassemble(data[i]))

      lines.push(`${address}  ${opcode}  ${operands}`)
    }

    return lines.join('\n')
  }
}

module.exports = {
  Disassembler,
}
