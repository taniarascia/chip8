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

// Load a new ROM every time a new game is selected
async function loadRom() {
  const rom = event.target.value
  const response = await fetch(`./roms/${rom}`)
  const arrayBuffer = await response.arrayBuffer()
  const uint8View = new Uint8Array(arrayBuffer)
  const romBuffer = new RomBuffer(uint8View)

  cpu.interface.clearDisplay()
  cpu.interface.disableSound()
  cpu.load(romBuffer)
  displayInstructions(rom)
}

function displayInstructions(rom) {
  let instructions

  switch (rom) {
    case 'CONNECT4':
      instructions = `Q = go left
E = go right
W = drop a coin

The coin color alternates with each play. 
This game has no win detection.
`
      break
    case 'TETRIS':
      instructions = `W = go left
E = go right
R = fall faster
Q = rotate piece`
      break
    case 'PONG':
      instructions = `Player 1:
      
2 = go up
Q = go down

Player 2:

Z = go up
X = go down`
      break
    case 'INVADERS':
      instructions = `W = start game
W = shoot
Q = go left
E = go right`
      break
  }

  const instructionsDisplay = document.querySelector('.instructions')
  instructionsDisplay.textContent = instructions
}

document.querySelector('select').addEventListener('change', loadRom)

cycle()
