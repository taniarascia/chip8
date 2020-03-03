const r = require('raylib')
const fs = require('fs')

const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { NativeCpuInterface } = require('../classes/interfaces/NativeCpuInterface')
const { DISPLAY_HEIGHT, DISPLAY_WIDTH } = require('../data/constants')
const getNativeKeyMap = require('../data/nativeKeyMap')

const fileContents = fs.readFileSync(process.argv.slice(2)[0])
if (!fileContents) throw new Error('File not found.')

const multiplier = 10
const screenWidth = DISPLAY_WIDTH * multiplier
const screenHeight = DISPLAY_HEIGHT * multiplier

const cpuInterface = new NativeCpuInterface()
const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(fileContents)

cpu.load(romBuffer)

r.InitWindow(screenWidth, screenHeight, 'Chip8.js')
r.SetTargetFPS(60)
r.ClearBackground(r.BLACK)

const nativeKeyMap = getNativeKeyMap(r)
let timer = 0

while (!r.WindowShouldClose()) {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  let keyDownIndices = 0
  // Run through all possible keys
  for (let i = 0; i < nativeKeyMap.length; i++) {
    const currentKey = nativeKeyMap[i]
    // If key is already down, add index to key down map
    // This will also lift up any keys that aren't pressed
    if (r.IsKeyDown(currentKey)) {
      keyDownIndices |= 1 << i
    }
  }

  // Set all pressed keys
  cpu.interface.setKeys(keyDownIndices)

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
