describe('Instruction set tests', () => {
  const { Disassembler } = require('../classes/Disassembler')

  test('02: 00E0 - CLS', () => {
    expect(Disassembler.disassemble(0x00e0).instruction).toHaveProperty('id', 'CLS')
    expect(Disassembler.disassemble(0x00e0).args).toHaveLength(0)
  })

  test('03: 00EE - RET', () => {
    expect(Disassembler.disassemble(0x00ee).instruction).toHaveProperty('id', 'RET')
    expect(Disassembler.disassemble(0x00ee).args).toHaveLength(0)
  })

  test('04: 1nnn - JP_ADDR', () => {
    expect(Disassembler.disassemble(0x1333).instruction).toHaveProperty('id', 'JP_ADDR')
    expect(Disassembler.disassemble(0x1333).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x1333).args[0]).toBe(0x333)
  })

  test('05: 2nnn - CALL_ADDR', () => {
    expect(Disassembler.disassemble(0x2062).instruction).toHaveProperty('id', 'CALL_ADDR')
    expect(Disassembler.disassemble(0x2062).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x2062).args[0]).toBe(0x062)
  })

  test('06: 3xkk - SE_VX_NN', () => {
    expect(Disassembler.disassemble(0x3abb).instruction).toHaveProperty('id', 'SE_VX_NN')
    expect(Disassembler.disassemble(0x3abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x3abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x3abb).args[1]).toBe(0xbb)
  })

  test('07: 4xkk - SNE_VX_NN', () => {
    expect(Disassembler.disassemble(0x4acc).instruction).toHaveProperty('id', 'SNE_VX_NN')
    expect(Disassembler.disassemble(0x4acc).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x4acc).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x4acc).args[1]).toBe(0xcc)
  })

  test('08: 5xy0 - SE_VX_VY', () => {
    expect(Disassembler.disassemble(0x5ab0).instruction).toHaveProperty('id', 'SE_VX_VY')
    expect(Disassembler.disassemble(0x5ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x5ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x5ab0).args[1]).toBe(0xb)
  })

  test('09: 6xkk - LD_VX_NN', () => {
    expect(Disassembler.disassemble(0x6abb).instruction).toHaveProperty('id', 'LD_VX_NN')
    expect(Disassembler.disassemble(0x6abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x6abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x6abb).args[1]).toBe(0xbb)
  })

  test('10: 7xkk - ADD_VX_NN', () => {
    expect(Disassembler.disassemble(0x7abb).instruction).toHaveProperty('id', 'ADD_VX_NN')
    expect(Disassembler.disassemble(0x7abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x7abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x7abb).args[1]).toBe(0xbb)
  })

  test('11: 8xy0 - LD_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab0).instruction).toHaveProperty('id', 'LD_VX_VY')
    expect(Disassembler.disassemble(0x8ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab0).args[1]).toBe(0xb)
  })

  test('12: 8xy1 - OR_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab1).instruction).toHaveProperty('id', 'OR_VX_VY')
    expect(Disassembler.disassemble(0x8ab1).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab1).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab1).args[1]).toBe(0xb)
  })

  test('13: 8xy2 - AND_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab2).instruction).toHaveProperty('id', 'AND_VX_VY')
    expect(Disassembler.disassemble(0x8ab2).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab2).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab2).args[1]).toBe(0xb)
  })

  test('14: 8xy3 - XOR_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab3).instruction).toHaveProperty('id', 'XOR_VX_VY')
    expect(Disassembler.disassemble(0x8ab3).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab3).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab3).args[1]).toBe(0xb)
  })

  test('15: 8xy4 - ADD_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab4).instruction).toHaveProperty('id', 'ADD_VX_VY')
    expect(Disassembler.disassemble(0x8ab4).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab4).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab4).args[1]).toBe(0xb)
  })

  test('16: 8xy5 - SUB_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab5).instruction).toHaveProperty('id', 'SUB_VX_VY')
    expect(Disassembler.disassemble(0x8ab5).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab5).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab5).args[1]).toBe(0xb)
  })

  test('17: 8xy6 - SHR_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab6).instruction).toHaveProperty('id', 'SHR_VX_VY')
    expect(Disassembler.disassemble(0x8ab6).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab6).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab6).args[1]).toBe(0xb)
  })

  test('18: 8xy7 - SUBN_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab7).instruction).toHaveProperty('id', 'SUBN_VX_VY')
    expect(Disassembler.disassemble(0x8ab7).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab7).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab7).args[1]).toBe(0xb)
  })

  test('19: 8xyE - SHL_VX_VY', () => {
    expect(Disassembler.disassemble(0x8abe).instruction).toHaveProperty('id', 'SHL_VX_VY')
    expect(Disassembler.disassemble(0x8abe).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8abe).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8abe).args[1]).toBe(0xb)
  })

  test('20: 9xy0 - SNE_VX_VY', () => {
    expect(Disassembler.disassemble(0x9ab0).instruction).toHaveProperty('id', 'SNE_VX_VY')
    expect(Disassembler.disassemble(0x9ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x9ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x9ab0).args[1]).toBe(0xb)
  })

  test('21: Annn - LD_I_ADDR', () => {
    expect(Disassembler.disassemble(0xa999).instruction).toHaveProperty('id', 'LD_I_ADDR')
    expect(Disassembler.disassemble(0xa999).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xa999).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xa999).args[1]).toBe(0x999)
  })

  test('22: Bnnn - JP_V0_ADDR', () => {
    expect(Disassembler.disassemble(0xb400).instruction).toHaveProperty('id', 'JP_V0_ADDR')
    expect(Disassembler.disassemble(0xb400).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xb400).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xb400).args[1]).toBe(0x400)
  })

  test('23: Cxkk - RND_VX_NN', () => {
    expect(Disassembler.disassemble(0xcabb).instruction).toHaveProperty('id', 'RND_VX_NN')
    expect(Disassembler.disassemble(0xcabb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xcabb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xcabb).args[1]).toBe(0xbb)
  })

  test('24: Dxyn - DRW_VX_VY_N', () => {
    expect(Disassembler.disassemble(0xdab9).instruction).toHaveProperty('id', 'DRW_VX_VY_N')
    expect(Disassembler.disassemble(0xdab9).args).toHaveLength(3)
    expect(Disassembler.disassemble(0xdab9).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xdab9).args[1]).toBe(0xb)
    expect(Disassembler.disassemble(0xdab9).args[2]).toBe(0x9)
  })

  test('25: Ex9E - SKP_VX', () => {
    expect(Disassembler.disassemble(0xea9e).instruction).toHaveProperty('id', 'SKP_VX')
    expect(Disassembler.disassemble(0xea9e).args).toHaveLength(1)
    expect(Disassembler.disassemble(0xea9e).args[0]).toBe(0xa)
  })

  test('26: ExA1 - SKNP_VX', () => {
    expect(Disassembler.disassemble(0xeba1).instruction).toHaveProperty('id', 'SKNP_VX')
    expect(Disassembler.disassemble(0xeba1).args).toHaveLength(1)
    expect(Disassembler.disassemble(0xeba1).args[0]).toBe(0xb)
  })

  test('27: Fx07 - LD_VX_DT', () => {
    expect(Disassembler.disassemble(0xfa07).instruction).toHaveProperty('id', 'LD_VX_DT')
    expect(Disassembler.disassemble(0xfa07).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa07).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xfa07).args[1]).toBe(0)
  })

  test('28: Fx0A - LD_VX_K', () => {
    expect(Disassembler.disassemble(0xfb0a).instruction).toHaveProperty('id', 'LD_VX_K')
    expect(Disassembler.disassemble(0xfb0a).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfb0a).args[0]).toBe(0xb)
    expect(Disassembler.disassemble(0xfb0a).args[1]).toBe(0)
  })

  test('29: Fx15 - LD_DT_VX', () => {
    expect(Disassembler.disassemble(0xfb15).instruction).toHaveProperty('id', 'LD_DT_VX')
    expect(Disassembler.disassemble(0xfb15).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfb15).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfb15).args[1]).toBe(0xb)
  })

  test('30: Fx18 - LD_ST_VX', () => {
    expect(Disassembler.disassemble(0xfa18).instruction).toHaveProperty('id', 'LD_ST_VX')
    expect(Disassembler.disassemble(0xfa18).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa18).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa18).args[1]).toBe(0xa)
  })

  test('31: Fx1E - ADD_I_VX', () => {
    expect(Disassembler.disassemble(0xfa1e).instruction).toHaveProperty('id', 'ADD_I_VX')
    expect(Disassembler.disassemble(0xfa1e).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa1e).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa1e).args[1]).toBe(0xa)
  })

  test('32: Fx29 - LD_F_VX', () => {
    expect(Disassembler.disassemble(0xfa29).instruction).toHaveProperty('id', 'LD_F_VX')
    expect(Disassembler.disassemble(0xfa29).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa29).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa29).args[1]).toBe(0xa)
  })

  test('33: Fx33 - LD_B_VX', () => {
    expect(Disassembler.disassemble(0xfa33).instruction).toHaveProperty('id', 'LD_B_VX')
    expect(Disassembler.disassemble(0xfa33).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa33).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa33).args[1]).toBe(0xa)
  })

  test('34: Fx55 - LD_I_VX', () => {
    expect(Disassembler.disassemble(0xfa55).instruction).toHaveProperty('id', 'LD_I_VX')
    expect(Disassembler.disassemble(0xfa55).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa55).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa55).args[1]).toBe(0xa)
  })

  test('35: Fx65 - LD_VX_I', () => {
    expect(Disassembler.disassemble(0xfa65).instruction).toHaveProperty('id', 'LD_VX_I')
    expect(Disassembler.disassemble(0xfa65).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa65).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xfa65).args[1]).toBe(0)
  })

  test('DW', () => {
    expect(Disassembler.disassemble(0x5154).instruction).toHaveProperty('id', 'DW')
    expect(Disassembler.disassemble(0x5154).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x5154).args[0]).toBe(0x5154)
  })
})
