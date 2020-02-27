const fs = require('fs')

const { RomBuffer } = require('../../classes/RomBuffer')

const fileContents = fs.readFileSync(process.argv.slice(2)[0])
if (!fileContents) throw new Error('File not found.')

const romBuffer = new RomBuffer(fileContents)

// Debugging Rom buffer
console.log(romBuffer.dump())
