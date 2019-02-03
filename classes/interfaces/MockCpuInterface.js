const { CpuInterface } = require('./CpuInterface')

class MockCpuInterface extends CpuInterface {
  // temporary derived class

  clearDisplay() {}

  waitKey() {
    return 0
  }

  getKeys() {
    return 0
  }

  drawPixel() {
    return true
  }

  enableSound() {}

  disableSound() {}
}

module.exports = {
  MockCpuInterface,
}
