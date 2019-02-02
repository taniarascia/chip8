class CpuInterface {
  constructor() {
    if (new.target === CpuInterface) {
      throw new TypeError('Cannot instantiate abstract class')
    }
  }

  draw() {
    throw new TypeError('Draw must be implemented on the inherited class.')
  }

  clear() {
    throw new TypeError('Clear must be implemented on the inherited class.')
  }
}

module.exports = {
  CpuInterface,
}
