const filename = process.argv.slice(2)[0]
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { TerminalCpuInterface } = require('../classes/interfaces/TerminalCpuInterface')
const cpuInterface = new TerminalCpuInterface()

const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(filename)

cpu.load(romBuffer)

let busy = false

setInterval(async () => {
  if (busy) return
  busy = true

  await cpu.step()
  busy = false
}, 3)

setInterval(() => {
  cpu.tick()
}, 16)
