const { CpuInterface } = require('./CpuInterface')

class NcursesCpuInterface extends CpuInterface {
  draw() {
    console.log('draw')
  }

  clear() {
    console.log('clear')
  }
}

module.exports = {
  NcursesCpuInterface,
}
