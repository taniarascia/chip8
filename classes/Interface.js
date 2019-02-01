class Interface {
  constructor() {
    if (new.target === Interface) {
      throw new TypeError('Cannot instantiate abstract class')
    }
  }

  createDisplay() {}

  draw() {}

  waitForKeyPress() {}

  setKey() {}

  delayTimeout() {}

  beep() {
    // sound timer timeout
  }
  displayError() {}
}

module.exports = {
  Interface,
}
