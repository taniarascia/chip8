const filename = process.argv.slice(2)[0]
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { NcursesCpuInterface } = require('../classes/interfaces/NcursesCpuInterface')
const ncursesCI = new NcursesCpuInterface()

const cpu = new CPU(ncursesCI)
const romBuffer = new RomBuffer(filename)

cpu.load(romBuffer)

setInterval(() => {
  cpu.step()
}, 3)

setInterval(() => {
  cpu.tick()
}, 16)
