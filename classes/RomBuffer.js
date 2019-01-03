class RomBuffer {
  constructor(filename, fs) {
    this.data = []

    let buffer = fs.readFileSync(filename)

    if (buffer.length % 2 !== 0) {
      throw new Error('Invalid input')
    }

    for (let i = 0; i < buffer.length; i += 2) {
      this.data.push((buffer[i] << 8) | (buffer[i + 1] << 0))
    }
  }

  dump() {
    let lines = []

    for (let i = 0; i < this.data.length; i += 8) {
      let address = (i * 2).toString(16).padStart(6, '0')
      let block = this.data.slice(i, i + 8)
      let hexString = block.map(value => value.toString(16).padStart(4, '0')).join(' ')

      lines.push(`${address} ${hexString}`)
    }

    return lines.join('\n')
  }
}

module.exports = {
  RomBuffer,
}
