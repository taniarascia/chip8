describe('decoded instructions test', () => {
  const { CPU } = require('../classes/CPU')
  const cpu = new CPU()

  beforeEach(() => {
    cpu.reset()
  })

  test.skip('test decoder 02: CLS', () => {})

  test.skip('test decoder 03: RET', () => {})

  test('test decoder 04: 1nnn - JP addr', () => {
    cpu.load({ data: [ 0x1333 ] })
    cpu.test()

    expect(cpu.PC).toBe(0x333)
  })

  test('test decoder 05: 2nnn - CALL addr', () => {
    cpu.load({ data: [ 0x2062 ] })
    const originalPC = cpu.PC
    cpu.test()

    expect(cpu.SP).toBe(1)
    expect(cpu.stack[cpu.SP]).toBe(originalPC)
    expect(cpu.PC).toBe(0x062)
  })

  test('test decoder 06: 3xkk - SE Vx, byte', () => {
    cpu.load({ data: [ 0x3abb ] })
    cpu.test()

    expect(cpu.PC).toBe(0x202)
  })

  test('test decoder 07: 4xkk - SNE Vx, byte', () => {
    cpu.load({ data: [ 0x4acc ] })
    cpu.test()

    expect(cpu.PC).toBe(0x204)
  })

  test('test decoder 08: 5xy0 - SE Vx, Vy', () => {
    cpu.load({ data: [ 0x5ab0 ] })
    cpu.test()

    expect(cpu.PC).toBe(0x204)
  })

  test('test decoder 09: 6xkk - LD Vx, byte', () => {
    cpu.load({ data: [ 0x6abb ] })
    cpu.test()

    expect(cpu.registers[0xa]).toBe(0xbb)
  })

  test('test decoder 10: 7xkk - ADD Vx, byte', () => {
    cpu.load({ data: [ 0x7abb ] })
    cpu.test()

    expect(cpu.registers[0xa]).toBe(0xbb)
  })

  test('test decoder 11: 8xy0 - LD Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab0 ] })
    cpu.test()

    expect(cpu.registers[0xa]).toBe(0)
  })
})
