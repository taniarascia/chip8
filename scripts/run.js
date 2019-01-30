const filename = process.argv.slice(2)[0]
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const cpu = new CPU()
const romBuffer = new RomBuffer(filename)

cpu.load(romBuffer)
cpu.run()
