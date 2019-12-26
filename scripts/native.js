// Imports
const r = require('raylib')
const fs = require('fs')
const fileContents = fs.readFileSync(process.argv.slice(2)[0])

// Classes
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { NativeCpuInterface } = require('../classes/interfaces/NativeCpuInterface')

// Constants
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../data/constants')
const nativeKeyMap = require('../data/nativeKeyMap')

const multiplier = 10
const screenWidth = DISPLAY_WIDTH * multiplier
const screenHeight = DISPLAY_HEIGHT * multiplier

// Instantiation
const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(fileContents)
const cpuInterface = new NativeCpuInterface()

cpu.load(romBuffer)

r.InitWindow(screenWidth, screenHeight, 'Chip8.js')
r.SetTargetFPS(60)
r.ClearBackground(r.BLACK)

let timer = 0

while (!r.WindowShouldClose()) {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  // Interpret key data
  const rawKeyPressed = r.GetKeyPressed()
  const keyIndex = nativeKeyMap.findIndex(key => rawKeyPressed === key)

  // Keydown event
  if (keyIndex) {
    cpu.interface.setKeys(keyIndex)
  } else {
    // Keyup event
    cpu.interface.resetKeys()
  }

  cpu.step()

  r.BeginDrawing()

  cpu.interface.frameBuffer.forEach((y, i) => {
    y.forEach((x, j) => {
      if (x) {
        r.DrawRectangleRec(
          {
            x: j * multiplier,
            y: i * multiplier,
            width: multiplier,
            height: multiplier,
          },
          r.GREEN
        )
      } else {
        r.DrawRectangleRec(
          {
            x: j * multiplier,
            y: i * multiplier,
            width: multiplier,
            height: multiplier,
          },
          r.BLACK
        )
      }
    })
  })

  r.EndDrawing()
}

r.CloseWindow()
