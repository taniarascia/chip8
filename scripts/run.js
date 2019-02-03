const filename = process.argv.slice(2)[0]
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { MockCpuInterface } = require('../classes/interfaces/MockCpuInterface')
const cpuInterface = new MockCpuInterface()

const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(filename)

cpu.load(romBuffer)

setInterval(() => {
  cpu.step()
}, 3)

setInterval(() => {
  cpu.tick()
}, 16)
