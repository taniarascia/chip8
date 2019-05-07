const filename = process.argv.slice(2)[0]
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { TerminalCpuInterface } = require('../classes/interfaces/TerminalCpuInterface')
const cpuInterface = new TerminalCpuInterface()

const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(filename)

cpu.load(romBuffer)

let timer = 0
async function cycle() {
  timer++
  if (timer % 5 === 0) cpu.tick()

  await cpu.step()

  setTimeout(cycle, 3)
}

cycle()
