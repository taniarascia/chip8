const { RomBuffer } = require('./classes/RomBuffer')
const { CPU } = require('./classes/CPU')
const { TerminalCpuInterface } = require('./classes/TerminalCpuInterface')
const { WebCpuInterface } = require('./classes/WebCpuInterface')
const { NativeCpuInterface } = require('./classes/NativeCpuInterface')

/**
 * Chip8.js entrypoint
 *
 * Export CPU, Rom Buffer, and all CPU interfaces for public npmjs repository.
 */
module.exports = {
  RomBuffer,
  CPU,
  TerminalCpuInterface,
  WebCpuInterface,
  NativeCpuInterface,
}
