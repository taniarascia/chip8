let timer = 0

function cycle() {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  if (!cpu.halted) {
    cpu.step()
  }

  setTimeout(cycle, 3)
}

async function loadRom() {
  const rom = event.target.value
  const response = await fetch(`./roms/${rom}`)
  const arrayBuffer = await response.arrayBuffer()
  const uint8View = new Uint8Array(arrayBuffer)
  const romBuffer = new RomBuffer(uint8View)

  cpu.interface.clearDisplay()
  cpu.load(romBuffer)
}

document.querySelector('select').addEventListener('change', loadRom)

cycle()
