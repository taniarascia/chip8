/**
 * CpuInterface
 *
 * An abstract class that all other CPU interfaces extend from.
 */
class CpuInterface {
  constructor() {
    if (new.target === CpuInterface) {
      throw new TypeError('Cannot instantiate abstract class')
    }
  }

  // All interfaces
  clearDisplay() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  waitKey() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  getKeys() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  drawPixel() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  enableSound() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  disableSound() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  // Native interface only
  setKeys() {
    throw new TypeError('Must be implemented on the inherited class.')
  }

  resetKeys() {
    throw new TypeError('Must be implemented on the inherited class.')
  }
}

module.exports = { CpuInterface }
