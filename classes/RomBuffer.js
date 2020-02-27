/**
 * RomBuffer
 *
 * Produce ROM data from a raw binary.
 */
class RomBuffer {
  /**
   * @param {binary} fileContents ROM binary
   */
  constructor(fileContents) {
    this.data = []

    // Read the raw data buffer from the file
    const buffer = fileContents

    // Create 16-bit big endian opcodes from the buffer
    for (let i = 0; i < buffer.length; i += 2) {
      this.data.push((buffer[i] << 8) | (buffer[i + 1] << 0))
    }
  }

  // Hex dump for debugging
  dump() {
    let lines = []

    for (let i = 0; i < this.data.length; i += 8) {
      const address = (i * 2).toString(16).padStart(6, '0')
      const block = this.data.slice(i, i + 8)
      const hexString = block.map(value => value.toString(16).padStart(4, '0')).join(' ')

      lines.push(`${address} ${hexString}`)
    }

    return lines.join('\n')
  }
}

module.exports = {
  RomBuffer,
}
