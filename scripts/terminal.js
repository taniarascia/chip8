const fs = require('fs')

const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { TerminalCpuInterface } = require('../classes/interfaces/TerminalCpuInterface')

const fileContents = fs.readFileSync(process.argv.slice(2)[0])
if (!fileContents) throw new Error('File not found')

const cpuInterface = new TerminalCpuInterface()
const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(fileContents)

cpu.load(romBuffer)

let timer = 0
function cycle() {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  cpu.step()

  setTimeout(cycle, 3)
}

cycle()
