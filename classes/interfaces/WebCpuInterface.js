const { CpuInterface } = require('./CpuInterface')

class WebCpuInterface extends CpuInterface {
  draw() {
    console.log('draw')
  }

  clear() {
    console.log('clear')
  }
}

module.exports = {
  WebCpuInterface,
}
