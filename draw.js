const { CPU } = require('./classes/CPU')
const cpu = new CPU()

for (let i = 0; i <= 80; i = i + 5) {
  cpu.load({ data: [0xdab5] })
  cpu.I = i
  cpu.step()
}
