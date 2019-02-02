const { CpuInterface } = require('./CpuInterface')

class LibuiCpuInterface extends CpuInterface {
  draw() {
    console.log('draw')
  }

  clear() {
    console.log('clear')
  }
}

module.exports = {
  LibuiCpuInterface,
}
