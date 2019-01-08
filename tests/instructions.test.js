let { Disassembler } = require('../classes/Disassembler')
let disassembler = new Disassembler()

test('test instruction 02: 00E0 - CLS', () => {
  expect(disassembler.disassemble(0x00e0).instruction).toHaveProperty('key', 2)
  expect(disassembler.disassemble(0x00e0).instruction).toHaveProperty('name', 'CLS')
  expect(disassembler.disassemble(0x00e0).args).toHaveLength(0)
})

test('test instruction 03: 00EE - RET', () => {
  expect(disassembler.disassemble(0x00ee).instruction).toHaveProperty('key', 3)
  expect(disassembler.disassemble(0x00ee).instruction).toHaveProperty('name', 'RET')
  expect(disassembler.disassemble(0x00ee).args).toHaveLength(0)
})

test('test instruction 04: 1nnn - JP addr', () => {
  expect(disassembler.disassemble(0x1333).instruction).toHaveProperty('key', 4)
  expect(disassembler.disassemble(0x1333).instruction).toHaveProperty('name', 'JP')
  expect(disassembler.disassemble(0x1333).args).toHaveLength(1)
})

test('test instruction 05: 2nnn - CALL addr', () => {
  expect(disassembler.disassemble(0x2062).instruction).toHaveProperty('key', 5)
  expect(disassembler.disassemble(0x2062).instruction).toHaveProperty('name', 'CALL')
  expect(disassembler.disassemble(0x2062).args).toHaveLength(1)
})

test('test instruction 06: 3xkk - SE Vx, byte', () => {
  expect(disassembler.disassemble(0x3abb).instruction).toHaveProperty('key', 6)
  expect(disassembler.disassemble(0x3abb).instruction).toHaveProperty('name', 'SE')
  expect(disassembler.disassemble(0x3abb).args).toHaveLength(2)
})

test('test instruction 07: 4xkk - SNE Vx', () => {
  expect(disassembler.disassemble(0x4acc).instruction).toHaveProperty('key', 7)
  expect(disassembler.disassemble(0x4acc).instruction).toHaveProperty('name', 'SNE')
  expect(disassembler.disassemble(0x4acc).args).toHaveLength(2)
})

test('test instruction 08: 5xy0 - SE Vx, Vy', () => {
  expect(disassembler.disassemble(0x5ab0).instruction).toHaveProperty('key', 8)
  expect(disassembler.disassemble(0x5ab0).instruction).toHaveProperty('name', 'SE')
  expect(disassembler.disassemble(0x5ab0).args).toHaveLength(2)
})

test('test instruction 09: 6xkk - LD Vx, byte', () => {
  expect(disassembler.disassemble(0x6abb).instruction).toHaveProperty('key', 9)
  expect(disassembler.disassemble(0x6abb).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0x6abb).args).toHaveLength(2)
})

test('test instruction 10: 7xkk - ADD Vx, byte', () => {
  expect(disassembler.disassemble(0x7abb).instruction).toHaveProperty('key', 10)
  expect(disassembler.disassemble(0x7abb).instruction).toHaveProperty('name', 'ADD')
  expect(disassembler.disassemble(0x7abb).args).toHaveLength(2)
})

test('test instruction 11: 8xy0 - LD Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab0).instruction).toHaveProperty('key', 11)
  expect(disassembler.disassemble(0x8ab0).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0x8ab0).args).toHaveLength(2)
})

test('test instruction 12: 8xy1 - OR Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab1).instruction).toHaveProperty('key', 12)
  expect(disassembler.disassemble(0x8ab1).instruction).toHaveProperty('name', 'OR')
  expect(disassembler.disassemble(0x8ab1).args).toHaveLength(2)
})

test('test instruction 13: 8xy2 - AND Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab2).instruction).toHaveProperty('key', 13)
  expect(disassembler.disassemble(0x8ab2).instruction).toHaveProperty('name', 'AND')
  expect(disassembler.disassemble(0x8ab2).args).toHaveLength(2)
})

test('test instruction 14: 8xy3 - XOR Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab3).instruction).toHaveProperty('key', 14)
  expect(disassembler.disassemble(0x8ab3).instruction).toHaveProperty('name', 'XOR')
  expect(disassembler.disassemble(0x8ab3).args).toHaveLength(2)
})

test('test instruction 15: 8xy4 - ADD Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab4).instruction).toHaveProperty('key', 15)
  expect(disassembler.disassemble(0x8ab4).instruction).toHaveProperty('name', 'ADD')
  expect(disassembler.disassemble(0x8ab4).args).toHaveLength(2)
})

test('test instruction 16: 8xy5 - SUB Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab5).instruction).toHaveProperty('key', 16)
  expect(disassembler.disassemble(0x8ab5).instruction).toHaveProperty('name', 'SUB')
  expect(disassembler.disassemble(0x8ab5).args).toHaveLength(2)
})

test('test instruction 17: 8xy6 - SHR Vx {, Vy}', () => {
  expect(disassembler.disassemble(0x8ab6).instruction).toHaveProperty('key', 17)
  expect(disassembler.disassemble(0x8ab6).instruction).toHaveProperty('name', 'SHR')
  expect(disassembler.disassemble(0x8ab6).args).toHaveLength(2)
})

test('test instruction 18: 8xy7 - SUBN Vx, Vy', () => {
  expect(disassembler.disassemble(0x8ab7).instruction).toHaveProperty('key', 18)
  expect(disassembler.disassemble(0x8ab7).instruction).toHaveProperty('name', 'SUBN')
  expect(disassembler.disassemble(0x8ab7).args).toHaveLength(2)
})

test('test instruction 19: 8xyE - SHL Vx, {, Vy}', () => {
  expect(disassembler.disassemble(0x8abe).instruction).toHaveProperty('key', 19)
  expect(disassembler.disassemble(0x8abe).instruction).toHaveProperty('name', 'SHL')
  expect(disassembler.disassemble(0x7abe).args).toHaveLength(2)
})

test('test instruction 20: 9xy0 - SNE Vx, Vy', () => {
  expect(disassembler.disassemble(0x9ab0).instruction).toHaveProperty('key', 20)
  expect(disassembler.disassemble(0x9ab0).instruction).toHaveProperty('name', 'SNE')
  expect(disassembler.disassemble(0x9ab0).args).toHaveLength(2)
})

test('test instruction 21: Annn - LD I, addr', () => {
  expect(disassembler.disassemble(0xa999).instruction).toHaveProperty('key', 21)
  expect(disassembler.disassemble(0xa999).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xa999).args).toHaveLength(2)
})

test('test instruction 22: Bnnn - JP V0, addr', () => {
  expect(disassembler.disassemble(0xb999).instruction).toHaveProperty('key', 22)
  expect(disassembler.disassemble(0xb999).instruction).toHaveProperty('name', 'JP')
  expect(disassembler.disassemble(0xb999).args).toHaveLength(2)
})

test('test instruction 23: Cxkk - RND Vx, byte', () => {
  expect(disassembler.disassemble(0xcabb).instruction).toHaveProperty('key', 23)
  expect(disassembler.disassemble(0xcabb).instruction).toHaveProperty('name', 'RND')
  expect(disassembler.disassemble(0xcabb).args).toHaveLength(2)
})

test('test instruction 24: Dxyn - DRW Vx, Vy, nibble', () => {
  expect(disassembler.disassemble(0xdab9).instruction).toHaveProperty('key', 24)
  expect(disassembler.disassemble(0xdab9).instruction).toHaveProperty('name', 'DRW')
  expect(disassembler.disassemble(0xdab9).args).toHaveLength(3)
})

test('test instruction 25: Ex9E - SKP Vx', () => {
  expect(disassembler.disassemble(0xea9e).instruction).toHaveProperty('key', 25)
  expect(disassembler.disassemble(0xea9e).instruction).toHaveProperty('name', 'SKP')
  expect(disassembler.disassemble(0xea9e).args).toHaveLength(1)
})

test('test instruction 26: ExA1 - SKNP Vx', () => {
  expect(disassembler.disassemble(0xeba1).instruction).toHaveProperty('key', 26)
  expect(disassembler.disassemble(0xeba1).instruction).toHaveProperty('name', 'SKNP')
  expect(disassembler.disassemble(0xeba1).args).toHaveLength(1)
})

test('test instruction 27: Fx07 - LD Vx, DT', () => {
  expect(disassembler.disassemble(0xfa07).instruction).toHaveProperty('key', 27)
  expect(disassembler.disassemble(0xfa07).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfa07).args).toHaveLength(2)
})

test('test instruction 28: Fx0A - LD Vx, K', () => {
  expect(disassembler.disassemble(0xfb0a).instruction).toHaveProperty('key', 28)
  expect(disassembler.disassemble(0xfb0a).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfb0a).args).toHaveLength(2)
})

test('test instruction 29: Fx15 - LD DT, Vx', () => {
  expect(disassembler.disassemble(0xfb15).instruction).toHaveProperty('key', 29)
  expect(disassembler.disassemble(0xfb15).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfb15).args).toHaveLength(2)
})

test('test instruction 30: Fx18 - LD ST, Vx', () => {
  expect(disassembler.disassemble(0xfa18).instruction).toHaveProperty('key', 30)
  expect(disassembler.disassemble(0xfa18).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfa18).args).toHaveLength(2)
})

test('test instruction 31: Fx1E - ADD I, Vx', () => {
  expect(disassembler.disassemble(0xfa1e).instruction).toHaveProperty('key', 31)
  expect(disassembler.disassemble(0xfa1e).instruction).toHaveProperty('name', 'ADD')
  expect(disassembler.disassemble(0xfa1e).args).toHaveLength(2)
})

test('test instruction 32: Fx29 - LD F, Vx', () => {
  expect(disassembler.disassemble(0xfa29).instruction).toHaveProperty('key', 32)
  expect(disassembler.disassemble(0xfa29).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfa29).args).toHaveLength(2)
})

test('test instruction 33: Fx33 - LD B, Vx', () => {
  expect(disassembler.disassemble(0xfa33).instruction).toHaveProperty('key', 33)
  expect(disassembler.disassemble(0xfa33).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfa33).args).toHaveLength(2)
})

test('test instruction 34: Fx55 - LD [I], Vx', () => {
  expect(disassembler.disassemble(0xfa55).instruction).toHaveProperty('key', 34)
  expect(disassembler.disassemble(0xfa55).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfa55).args).toHaveLength(2)
})

test('test instruction 35: Fx65 - LD Vx, [I]', () => {
  expect(disassembler.disassemble(0xfa65).instruction).toHaveProperty('key', 35)
  expect(disassembler.disassemble(0xfa65).instruction).toHaveProperty('name', 'LD')
  expect(disassembler.disassemble(0xfa65).args).toHaveLength(2)
})

test('test data word', () => {
  expect(disassembler.disassemble(0x5154).instruction).toHaveProperty('key', 36)
  expect(disassembler.disassemble(0x5154).instruction).toHaveProperty('name', 'DW')
  expect(disassembler.disassemble(0x5154).args).toHaveLength(1)
})
