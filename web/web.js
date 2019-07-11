let timer = 0
let cpuStep

async function cycle() {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  if (!cpu.halted) {
    cpuStep = cpu.step()
    await cpuStep
  }

  setTimeout(cycle, 3)
}

async function loadRom() {
  const rom = event.target.value
  const response = await fetch(`./roms/${rom}`)
  const arrayBuffer = await response.arrayBuffer()
  const uint8View = new Uint8Array(arrayBuffer)
  const romBuffer = new RomBuffer(uint8View)

  if (!cpu.halted) {
    cpu.halt()
    await cpuStep
  }
  cpu.interface.clearDisplay()
  cpu.load(romBuffer)
}

document.querySelector('select').addEventListener('change', loadRom)
cycle()
