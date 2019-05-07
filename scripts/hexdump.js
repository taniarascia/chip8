const fs = require('fs')
const fileContents = fs.readFileSync(process.argv.slice(2)[0])
const { RomBuffer } = require('../classes/RomBuffer')
const romBuffer = new RomBuffer(fileContents)

console.log(romBuffer.dump())
