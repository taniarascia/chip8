const fs = require('fs')
const filename = process.argv.slice(2)[0]
const { RomBuffer } = require('./classes/RomBuffer')

const romBuffer = new RomBuffer(filename)
console.log(romBuffer.dump())
