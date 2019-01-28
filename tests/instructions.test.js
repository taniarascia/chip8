describe('Instructions tests', () => {
  const { Disassembler } = require('../classes/Disassembler')

  test('test instruction 02: 00E0 - CLS', () => {
    expect(Disassembler.disassemble(0x00e0).instruction).toHaveProperty('id', 'CLS')
    expect(Disassembler.disassemble(0x00e0).args).toHaveLength(0)
  })

  test('test instruction 03: 00EE - RET', () => {
    expect(Disassembler.disassemble(0x00ee).instruction).toHaveProperty('id', 'RET')
    expect(Disassembler.disassemble(0x00ee).args).toHaveLength(0)
  })

  test('test instruction 04: 1nnn - JP addr', () => {
    expect(Disassembler.disassemble(0x1333).instruction).toHaveProperty('id', 'JP_ADDR')
    expect(Disassembler.disassemble(0x1333).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x1333).args[0]).toBe(0x333)
  })

  test('test instruction 05: 2nnn - CALL addr', () => {
    expect(Disassembler.disassemble(0x2062).instruction).toHaveProperty('id', 'CALL_ADDR')
    expect(Disassembler.disassemble(0x2062).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x2062).args[0]).toBe(0x062)
  })

  test('test instruction 06: 3xkk - SE Vx, byte', () => {
    expect(Disassembler.disassemble(0x3abb).instruction).toHaveProperty('id', 'SE_VX_NN')
    expect(Disassembler.disassemble(0x3abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x3abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x3abb).args[1]).toBe(0xbb)
  })

  test('test instruction 07: 4xkk - SNE Vx, byte', () => {
    expect(Disassembler.disassemble(0x4acc).instruction).toHaveProperty('id', 'SNE_VX_NN')
    expect(Disassembler.disassemble(0x4acc).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x4acc).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x4acc).args[1]).toBe(0xcc)
  })

  test('test instruction 08: 5xy0 - SE Vx, Vy', () => {
    expect(Disassembler.disassemble(0x5ab0).instruction).toHaveProperty('id', 'SE_VX_VY')
    expect(Disassembler.disassemble(0x5ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x5ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x5ab0).args[1]).toBe(0xb)
  })

  test('test instruction 09: 6xkk - LD Vx, byte', () => {
    expect(Disassembler.disassemble(0x6abb).instruction).toHaveProperty('id', 'LD_VX_NN')
    expect(Disassembler.disassemble(0x6abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x6abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x6abb).args[1]).toBe(0xbb)
  })

  test('test instruction 10: 7xkk - ADD Vx, byte', () => {
    expect(Disassembler.disassemble(0x7abb).instruction).toHaveProperty('id', 'ADD_VX_NN')
    expect(Disassembler.disassemble(0x7abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x7abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x7abb).args[1]).toBe(0xbb)
  })

  test('test instruction 11: 8xy0 - LD Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab0).instruction).toHaveProperty('id', 'LD_VX_VY')
    expect(Disassembler.disassemble(0x8ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab0).args[1]).toBe(0xb)
  })

  test('test instruction 12: 8xy1 - OR Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab1).instruction).toHaveProperty('id', 'OR_VX_VY')
    expect(Disassembler.disassemble(0x8ab1).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab1).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab1).args[1]).toBe(0xb)
  })

  test('test instruction 13: 8xy2 - AND Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab2).instruction).toHaveProperty('id', 'AND_VX_VY')
    expect(Disassembler.disassemble(0x8ab2).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab2).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab2).args[1]).toBe(0xb)
  })

  test('test instruction 14: 8xy3 - XOR Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab3).instruction).toHaveProperty('id', 'XOR_VX_VY')
    expect(Disassembler.disassemble(0x8ab3).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab3).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab3).args[1]).toBe(0xb)
  })

  test('test instruction 15: 8xy4 - ADD Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab4).instruction).toHaveProperty('id', 'ADD_VX_VY')
    expect(Disassembler.disassemble(0x8ab4).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab4).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab4).args[1]).toBe(0xb)
  })

  test('test instruction 16: 8xy5 - SUB Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab5).instruction).toHaveProperty('id', 'SUB_VX_VY')
    expect(Disassembler.disassemble(0x8ab5).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab5).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab5).args[1]).toBe(0xb)
  })

  test('test instruction 17: 8xy6 - SHR Vx {, Vy}', () => {
    expect(Disassembler.disassemble(0x8ab6).instruction).toHaveProperty('id', 'SHR_VX_VY')
    expect(Disassembler.disassemble(0x8ab6).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab6).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab6).args[1]).toBe(0xb)
  })

  test('test instruction 18: 8xy7 - SUBN Vx, Vy', () => {
    expect(Disassembler.disassemble(0x8ab7).instruction).toHaveProperty('id', 'SUBN_VX_VY')
    expect(Disassembler.disassemble(0x8ab7).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab7).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab7).args[1]).toBe(0xb)
  })

  test('test instruction 19: 8xyE - SHL Vx, {, Vy}', () => {
    expect(Disassembler.disassemble(0x8abe).instruction).toHaveProperty('id', 'SHL_VX_VY')
    expect(Disassembler.disassemble(0x8abe).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8abe).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8abe).args[1]).toBe(0xb)
  })

  test('test instruction 20: 9xy0 - SNE Vx, Vy', () => {
    expect(Disassembler.disassemble(0x9ab0).instruction).toHaveProperty('id', 'SNE_VX_VY')
    expect(Disassembler.disassemble(0x9ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x9ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x9ab0).args[1]).toBe(0xb)
  })

  test('test instruction 21: Annn - LD I, addr', () => {
    expect(Disassembler.disassemble(0xa999).instruction).toHaveProperty('id', 'LD_I_ADDR')
    expect(Disassembler.disassemble(0xa999).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xa999).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xa999).args[1]).toBe(0x999)
  })

  test('test instruction 22: Bnnn - JP V0, addr', () => {
    expect(Disassembler.disassemble(0xb400).instruction).toHaveProperty('id', 'JP_V0_ADDR')
    expect(Disassembler.disassemble(0xb400).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xb400).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xb400).args[1]).toBe(0x400)
  })

  test('test instruction 23: Cxkk - RND Vx, byte', () => {
    expect(Disassembler.disassemble(0xcabb).instruction).toHaveProperty('id', 'RND_VX_NN')
    expect(Disassembler.disassemble(0xcabb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xcabb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xcabb).args[1]).toBe(0xbb)
  })

  test('test instruction 24: Dxyn - DRW Vx, Vy, nibble', () => {
    expect(Disassembler.disassemble(0xdab9).instruction).toHaveProperty('id', 'DRW_VX_VY_N')
    expect(Disassembler.disassemble(0xdab9).args).toHaveLength(3)
    expect(Disassembler.disassemble(0xdab9).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xdab9).args[1]).toBe(0xb)
    expect(Disassembler.disassemble(0xdab9).args[2]).toBe(0x9)
  })

  test('test instruction 25: Ex9E - SKP Vx', () => {
    expect(Disassembler.disassemble(0xea9e).instruction).toHaveProperty('id', 'SKP_VX')
    expect(Disassembler.disassemble(0xea9e).args).toHaveLength(1)
    expect(Disassembler.disassemble(0xea9e).args[0]).toBe(0xa)
  })

  test('test instruction 26: ExA1 - SKNP Vx', () => {
    expect(Disassembler.disassemble(0xeba1).instruction).toHaveProperty('id', 'SKNP_VX')
    expect(Disassembler.disassemble(0xeba1).args).toHaveLength(1)
    expect(Disassembler.disassemble(0xeba1).args[0]).toBe(0xb)
  })

  test('test instruction 27: Fx07 - LD Vx, DT', () => {
    expect(Disassembler.disassemble(0xfa07).instruction).toHaveProperty('id', 'LD_VX_DT')
    expect(Disassembler.disassemble(0xfa07).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa07).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xfa07).args[1]).toBe(0)
  })

  test('test instruction 28: Fx0A - LD Vx, K', () => {
    expect(Disassembler.disassemble(0xfb0a).instruction).toHaveProperty('id', 'LD_VX_K')
    expect(Disassembler.disassemble(0xfb0a).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfb0a).args[0]).toBe(0xb)
    expect(Disassembler.disassemble(0xfb0a).args[1]).toBe(0)
  })

  test('test instruction 29: Fx15 - LD DT, Vx', () => {
    expect(Disassembler.disassemble(0xfb15).instruction).toHaveProperty('id', 'LD_DT_VX')
    expect(Disassembler.disassemble(0xfb15).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfb15).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfb15).args[1]).toBe(0xb)
  })

  test('test instruction 30: Fx18 - LD ST, Vx', () => {
    expect(Disassembler.disassemble(0xfa18).instruction).toHaveProperty('id', 'LD_ST_VX')
    expect(Disassembler.disassemble(0xfa18).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa18).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa18).args[1]).toBe(0xa)
  })

  test('test instruction 31: Fx1E - ADD I, Vx', () => {
    expect(Disassembler.disassemble(0xfa1e).instruction).toHaveProperty('id', 'ADD_I_VX')
    expect(Disassembler.disassemble(0xfa1e).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa1e).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa1e).args[1]).toBe(0xa)
  })

  test('test instruction 32: Fx29 - LD F, Vx', () => {
    expect(Disassembler.disassemble(0xfa29).instruction).toHaveProperty('id', 'LD_F_VX')
    expect(Disassembler.disassemble(0xfa29).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa29).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa29).args[1]).toBe(0xa)
  })

  test('test instruction 33: Fx33 - LD B, Vx', () => {
    expect(Disassembler.disassemble(0xfa33).instruction).toHaveProperty('id', 'LD_B_VX')
    expect(Disassembler.disassemble(0xfa33).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa33).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa33).args[1]).toBe(0xa)
  })

  test('test instruction 34: Fx55 - LD [I], Vx', () => {
    expect(Disassembler.disassemble(0xfa55).instruction).toHaveProperty('id', 'LD_I_VX')
    expect(Disassembler.disassemble(0xfa55).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa55).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa55).args[1]).toBe(0xa)
  })

  test('test instruction 35: Fx65 - LD Vx, [I]', () => {
    expect(Disassembler.disassemble(0xfa65).instruction).toHaveProperty('id', 'LD_VX_I')
    expect(Disassembler.disassemble(0xfa65).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa65).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xfa65).args[1]).toBe(0)
  })

  test('test data word', () => {
    expect(Disassembler.disassemble(0x5154).instruction).toHaveProperty('id', 'DW')
    expect(Disassembler.disassemble(0x5154).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x5154).args[0]).toBe(0x5154)
  })
})
