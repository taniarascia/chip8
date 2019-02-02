describe('CPU tests', () => {
  const { CPU } = require('../classes/CPU')
  const cpu = new CPU(null)

  test('CPU does not execute after halting', () => {
    cpu.load({ data: 0x0000 })
    cpu.halted = true

    expect(() => {
      cpu.step()
    }).toThrowError(
      'A problem has been detected and Chip-8 has been shut down to prevent damage to your computer.'
    )
  })

  // test.skip('test cpu 02: CLS', () => {})

  test('test cpu 03: RET', () => {
    cpu.load({ data: [ 0x00ee ] })
    cpu.SP = 2
    cpu.stack[2] = 0xf
    cpu.step()

    expect(cpu.PC).toBe(0xf)
    expect(cpu.SP).toBe(0x1)

    cpu.load({ data: [ 0x00ee ] })

    expect(() => {
      cpu.step()
    }).toThrowError('Stack underflow.')
  })

  test('test cpu 04: 1nnn - JP addr', () => {
    cpu.load({ data: [ 0x1333 ] })
    cpu.step()

    expect(cpu.PC).toBe(0x333)
  })

  test('test cpu 05: 2nnn - CALL addr', () => {
    cpu.load({ data: [ 0x2062 ] })
    const PC = cpu.PC
    cpu.step()

    expect(cpu.SP).toBe(0)
    expect(cpu.stack[cpu.SP]).toBe(PC + 2)
    expect(cpu.PC).toBe(0x062)

    cpu.load({ data: [ 0x2062 ] })
    cpu.SP = 15

    expect(() => {
      cpu.step()
    }).toThrowError('Stack overflow.')
  })

  test('test cpu 06: 3xkk - SE Vx, byte', () => {
    cpu.load({ data: [ 0x3abb ] })
    cpu.step()

    expect(cpu.PC).toBe(0x202)

    cpu.load({ data: [ 0x3abb ] })
    cpu.registers[0xa] = 0xbb
    cpu.step()

    expect(cpu.PC).toBe(0x204)
  })

  test('test cpu 07: 4xkk - SNE Vx, byte', () => {
    cpu.load({ data: [ 0x4acc ] })
    cpu.step()

    expect(cpu.PC).toBe(0x204)

    cpu.load({ data: [ 0x4acc ] })
    cpu.registers[0xa] = 0xcc
    cpu.step()

    expect(cpu.PC).toBe(0x202)
  })

  test('test cpu 08: 5xy0 - SE Vx, Vy', () => {
    cpu.load({ data: [ 0x5ab0 ] })
    cpu.step()

    expect(cpu.PC).toBe(0x204)

    cpu.load({ data: [ 0x5ab0 ] })
    cpu.registers[0xa] = 0x5
    cpu.step()

    expect(cpu.PC).toBe(0x202)
  })

  test('test cpu 09: 6xkk - LD Vx, byte', () => {
    cpu.load({ data: [ 0x6abb ] })
    cpu.registers[0xa] = 0x10
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0xbb)
  })

  test('test cpu 10: 7xkk - ADD Vx, byte', () => {
    cpu.load({ data: [ 0x7abb ] })
    cpu.registers[0xa] = 0x10
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0x10 + 0xbb)
  })

  test('test cpu 11: 8xy0 - LD Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab0 ] })
    cpu.registers[0xb] = 0x8
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0x8)
  })

  test('test cpu 12: 8xy1 - OR Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab1 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x4
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0x7)
  })

  test('test cpu 13: 8xy2 - AND Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab2 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x4
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0)
  })

  test('test cpu 14: 8xy3 - XOR Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab3 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x3
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0)
  })

  test('test cpu 15: 8xy4 - ADD Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab4 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x4
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0x7)
    expect(cpu.registers[0xf]).toBe(0)

    cpu.load({ data: [ 0x8ab4 ] })
    cpu.registers[0xa] = 0xff
    cpu.registers[0xb] = 0xff
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0xfe)
    expect(cpu.registers[0xf]).toBe(1)
  })

  test('test cpu 16: 8xy5 - SUB Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab5 ] })
    cpu.registers[0xa] = 0x4
    cpu.registers[0xb] = 0x2
    cpu.step()

    expect(cpu.registers[0xa]).toBe(2)
    expect(cpu.registers[0xf]).toBe(1)

    cpu.load({ data: [ 0x8ab5 ] })
    cpu.registers[0xa] = 0x2
    cpu.registers[0xb] = 0x3
    cpu.step()

    expect(cpu.registers[0xa]).toBe(255)
    expect(cpu.registers[0xf]).toBe(0)
  })

  test('test cpu 17: 8xy6 - SHR Vx {, Vy}', () => {
    cpu.load({ data: [ 0x8ab6 ] })
    cpu.registers[0xa] = 0x3
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0x3 >> 1)
    expect(cpu.registers[0xf]).toBe(1)
  })

  test('test cpu 18: 8xy7 - SUBN Vx, Vy', () => {
    cpu.load({ data: [ 0x8ab7 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x2
    cpu.step()

    expect(cpu.registers[0xa]).toBe(255)
    expect(cpu.registers[0xf]).toBe(0)

    cpu.load({ data: [ 0x8ab7 ] })
    cpu.registers[0xa] = 0x2
    cpu.registers[0xb] = 0x3
    cpu.step()

    expect(cpu.registers[0xa]).toBe(1)
    expect(cpu.registers[0xf]).toBe(1)
  })

  test('test cpu 19: 8xyE - SHL Vx, {, Vy}', () => {
    cpu.load({ data: [ 0x8abe ] })
    cpu.registers[0xa] = 0x3
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0x3 << 1)
    expect(cpu.registers[0xf]).toBe(0)
  })

  test('test cpu 20: 9xy0 - SNE Vx, Vy', () => {
    cpu.load({ data: [ 0x9ab0 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x4
    cpu.step()

    expect(cpu.PC).toBe(0x204)

    cpu.load({ data: [ 0x9ab0 ] })
    cpu.registers[0xa] = 0x3
    cpu.registers[0xb] = 0x3
    cpu.step()

    expect(cpu.PC).toBe(0x202)
  })

  test('test cpu 21: Annn - LD I, addr', () => {
    cpu.load({ data: [ 0xa999 ] })
    cpu.step()

    expect(cpu.I).toBe(0x999)
  })

  test('test cpu 22: Bnnn - JP V0, addr', () => {
    cpu.load({ data: [ 0xb300 ] })
    cpu.registers[0] = 0x2
    cpu.step()

    expect(cpu.PC).toBe(0x2 + 0x300)
  })

  // test.skip('test cpu 23: Cxkk - RND Vx, byte', () => {})

  test('test cpu 24: Dxyn - DRW Vx, Vy, nibble', () => {
    cpu.load({ data: [ 0xdab5 ] })
    cpu.I = 4091

    expect(() => {
      cpu.step()
    }).toThrowError('Memory out of bounds.')
    // todo: passing test
  })

  test('test cpu 25: Ex9E - SKP Vx', () => {
    // todo
    cpu.load({ data: [ 0xea9e ] })
    cpu.registers[0xa] = 0
    cpu.step()

    expect(cpu.PC).toBe(0x204)

    cpu.load({ data: [ 0xea9e ] })
    cpu.registers[0xa] = 1
    cpu.step()

    expect(cpu.PC).toBe(0x202)
  })

  test('test cpu 26: ExA1 - SKNP Vx', () => {
    // todo
    cpu.load({ data: [ 0xeba1 ] })
    cpu.registers[0xb] = 0
    cpu.step()

    expect(cpu.PC).toBe(0x202)

    cpu.load({ data: [ 0xea9e ] })
    cpu.registers[0xb] = 1
    cpu.step()

    expect(cpu.PC).toBe(0x204)
  })

  test('test cpu 27: Fx07 - LD Vx, DT', () => {
    cpu.load({ data: [ 0xfa07 ] })
    cpu.DT = 0xf
    cpu.step()

    expect(cpu.registers[0xa]).toBe(0xf)
  })

  test('test cpu 28: Fx0A - LD Vx, K', () => {
    // todo
    cpu.load({ data: [ 0xfb0a ] })
    cpu.step()

    expect(cpu.registers[0xb]).toBe(0)
  })

  test('test cpu 29: Fx15 - LD DT, Vx', () => {
    cpu.load({ data: [ 0xfb15 ] })
    cpu.registers[0xb] = 0xf
    cpu.step()

    expect(cpu.DT).toBe(0xf)
  })

  test('test cpu 30: Fx18 - LD ST, Vx', () => {
    cpu.load({ data: [ 0xfa18 ] })
    cpu.registers[0xa] = 0xf
    cpu.step()

    expect(cpu.ST).toBe(0xf)
  })

  test('test cpu 31: Fx1E - ADD I, Vx', () => {
    cpu.load({ data: [ 0xfa1e ] })
    cpu.I = 0xe
    cpu.registers[0xa] = 0xf
    cpu.step()

    expect(cpu.I).toBe(0xe + 0xf)
  })

  test('test cpu 32: Fx29 - LD F, Vx', () => {
    cpu.load({ data: [ 0xfa29 ] })
    cpu.registers[0xa] = 16

    expect(() => {
      cpu.step()
    }).toThrowError('Invalid digit.')

    cpu.load({ data: [ 0xfa29 ] })
    cpu.registers[0xa] = 0xa
    cpu.step()

    expect(cpu.I).toBe(0xa * 5)

    // todo print a to console for now
    cpu.load({ data: [ 0xfa29, 0xdab5 ] })
    cpu.registers[0xa] = 0xa
    cpu.step()
    cpu.step()
  })

  test('test cpu 33: Fx33 - LD B, Vx', () => {
    cpu.load({ data: [ 0xfa33 ] })
    cpu.registers[0xa] = 0x7b
    cpu.I = 0x300
    cpu.step()

    expect(cpu.memory[0x300]).toBe(1)
    expect(cpu.memory[0x301]).toBe(2)
    expect(cpu.memory[0x302]).toBe(3)

    cpu.load({ data: [ 0xfa33 ] })
    cpu.registers[0xa] = 0x7b
    cpu.I = 4094

    expect(() => {
      cpu.step()
    }).toThrowError('Memory out of bounds.')
  })

  test('test cpu 34: Fx55 - LD [I], Vx', () => {
    cpu.load({ data: [ 0xfb55 ] })
    cpu.I = 0x400

    for (let i = 0; i <= 0xb; i++) {
      cpu.registers[i] = i
    }
    cpu.step()

    for (let i = 0; i <= 0xb; i++) {
      expect(cpu.memory[cpu.I + i]).toBe(i)
    }
    expect(cpu.memory[cpu.I + 0xc]).toBe(0)

    cpu.load({ data: [ 0xfb55 ] })
    cpu.I = 4085

    expect(() => {
      cpu.step()
    }).toThrowError('Memory out of bounds.')
  })

  test('test cpu 35: Fx65 - LD Vx, [I]', () => {
    cpu.load({ data: [ 0xfa65 ] })
    cpu.I = 0x400

    for (let i = 0; i <= 0xa; i++) {
      cpu.registers[i] = i
    }
    cpu.step()

    for (let i = 0; i <= 0xa; i++) {
      expect(cpu.registers[i]).toBe(i)
    }
    expect(cpu.registers[0xb]).toBe(0)

    cpu.load({ data: [ 0xfa65 ] })
    cpu.I = 4086

    expect(() => {
      cpu.step()
    }).toThrowError('Memory out of bounds.')
  })

  test('test data word', () => {
    cpu.load({ data: [ 0x5154 ] })

    expect(() => {
      cpu.step()
    }).toThrowError('Illegal instruction.')
  })
})
