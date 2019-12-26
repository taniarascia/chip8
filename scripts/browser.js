const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { DOMCpuInterface } = require('../classes/interfaces/DOMCpuInterface')

const cpuInterface = new DOMCpuInterface()
const cpu = new CPU(cpuInterface)

global.cpu = cpu
global.RomBuffer = RomBuffer
