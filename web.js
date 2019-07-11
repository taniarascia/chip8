let timeout = null
let timer = 0

const cycle = async () => {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  await cpu.step()
  timeout = setTimeout(cycle, 3)
}

const loadRom = async rom => {
  const response = await fetch(`./roms/${rom}`)
  const arrayBuffer = await response.arrayBuffer()
  const uint8View = new Uint8Array(arrayBuffer)
  const romBuffer = new RomBuffer(uint8View)

  cpu.interface.clearDisplay()
  cpu.load(romBuffer)

  cycle()
}

const changeRom = event => {
  const rom = event.target.value

  cpu.halt()
  clearTimeout(timeout)

  loadRom(rom)
}

document.querySelector('select').addEventListener('change', changeRom)
