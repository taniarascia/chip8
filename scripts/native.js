const r = require('raylib')
const fs = require('fs')
const fileContents = fs.readFileSync(process.argv.slice(2)[0])
const { CPU } = require('../classes/CPU')
const { RomBuffer } = require('../classes/RomBuffer')
const { NativeCpuInterface } = require('../classes/interfaces/NativeCpuInterface')
const cpuInterface = new NativeCpuInterface()

const cpu = new CPU(cpuInterface)
const romBuffer = new RomBuffer(fileContents)

cpu.load(romBuffer)

let timer = 0
async function cycle() {
  timer++

  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  await cpu.step()
}

while (!r.WindowShouldClose()) {
  r.BeginDrawing()

  cycle()
  isAnyKeyPressed()

  r.EndDrawing()
}

process.exit(0)
r.CloseWindow()

function isAnyKeyPressed() {
  let keyPressed = false
  let key = r.GetKeyPressed()

  if (key >= 32 && key <= 126) keyPressed = true

  return keyPressed
}
