const filename = process.argv.slice(2)[0]
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { TerminalCpuInterface } = require('../classes/interfaces/TerminalCpuInterface')
const cpuInterface = new TerminalCpuInterface()

const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(filename)

cpu.load(romBuffer)

async function f() {
  await cpu.step()
  setTimeout(f, 3)
}
f()

setInterval(() => {
  cpu.tick()
}, 16)
