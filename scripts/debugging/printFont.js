const { CPU } = require('../../classes/CPU')
const { TerminalCpuInterface } = require('../../classes/interfaces/TerminalCpuInterface')

const cpuInterface = new TerminalCpuInterface()
const cpu = new CPU(cpuInterface)

// Debugging fonts
for (let i = 0; i < 76; i = i + 5) {
  cpu.load({ data: [0xdab5] })
  cpu.I = i
  cpu.step()
}
