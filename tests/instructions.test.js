describe('Instruction set tests', () => {
  const Disassembler = require('../classes/Disassembler')

  test('2: Expect disassembler to match opcode 00E0 to instruction CLS', () => {
    expect(Disassembler.disassemble(0x00e0).instruction).toHaveProperty('id', 'CLS')
    expect(Disassembler.disassemble(0x00e0).args).toHaveLength(0)
  })

  test('3: Expect disassembler to match opcode 00EE to instruction RET', () => {
    expect(Disassembler.disassemble(0x00ee).instruction).toHaveProperty('id', 'RET')
    expect(Disassembler.disassemble(0x00ee).args).toHaveLength(0)
  })

  test('4: Expect disassembler to match opcode 1nnn to instruction JP_ADDR', () => {
    expect(Disassembler.disassemble(0x1333).instruction).toHaveProperty('id', 'JP_ADDR')
    expect(Disassembler.disassemble(0x1333).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x1333).args[0]).toBe(0x333)
  })

  test('5: Expect disassembler to match opcode 2nnn to instruction CALL_ADDR', () => {
    expect(Disassembler.disassemble(0x2062).instruction).toHaveProperty('id', 'CALL_ADDR')
    expect(Disassembler.disassemble(0x2062).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x2062).args[0]).toBe(0x062)
  })

  test('6: Expect disassembler to match opcode 3xnn to instruction SE_VX_NN', () => {
    expect(Disassembler.disassemble(0x3abb).instruction).toHaveProperty('id', 'SE_VX_NN')
    expect(Disassembler.disassemble(0x3abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x3abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x3abb).args[1]).toBe(0xbb)
  })

  test('7: Expect disassembler to match opcode 4xnn to instruction SNE_VX_NN', () => {
    expect(Disassembler.disassemble(0x4acc).instruction).toHaveProperty('id', 'SNE_VX_NN')
    expect(Disassembler.disassemble(0x4acc).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x4acc).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x4acc).args[1]).toBe(0xcc)
  })

  test('8: Expect disassembler to match opcode 5xy0 to instruction SE_VX_VY', () => {
    expect(Disassembler.disassemble(0x5ab0).instruction).toHaveProperty('id', 'SE_VX_VY')
    expect(Disassembler.disassemble(0x5ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x5ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x5ab0).args[1]).toBe(0xb)
  })

  test('9: Expect disassembler to match opcode 6xnn to instruction LD_VX_NN', () => {
    expect(Disassembler.disassemble(0x6abb).instruction).toHaveProperty('id', 'LD_VX_NN')
    expect(Disassembler.disassemble(0x6abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x6abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x6abb).args[1]).toBe(0xbb)
  })

  test('10: Expect disassembler to match opcode 7xnn to instruction ADD_VX_NN', () => {
    expect(Disassembler.disassemble(0x7abb).instruction).toHaveProperty('id', 'ADD_VX_NN')
    expect(Disassembler.disassemble(0x7abb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x7abb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x7abb).args[1]).toBe(0xbb)
  })

  test('11: Expect disassembler to match opcode 8xy0 to instruction LD_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab0).instruction).toHaveProperty('id', 'LD_VX_VY')
    expect(Disassembler.disassemble(0x8ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab0).args[1]).toBe(0xb)
  })

  test('12: Expect disassembler to match opcode 8xy1 to instruction OR_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab1).instruction).toHaveProperty('id', 'OR_VX_VY')
    expect(Disassembler.disassemble(0x8ab1).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab1).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab1).args[1]).toBe(0xb)
  })

  test('13: Expect disassembler to match opcode 8xy2 to instruction AND_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab2).instruction).toHaveProperty('id', 'AND_VX_VY')
    expect(Disassembler.disassemble(0x8ab2).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab2).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab2).args[1]).toBe(0xb)
  })

  test('14: Expect disassembler to match opcode 8xy3 to instruction XOR_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab3).instruction).toHaveProperty('id', 'XOR_VX_VY')
    expect(Disassembler.disassemble(0x8ab3).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab3).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab3).args[1]).toBe(0xb)
  })

  test('15: Expect disassembler to match opcode 8xy4 to instruction ADD_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab4).instruction).toHaveProperty('id', 'ADD_VX_VY')
    expect(Disassembler.disassemble(0x8ab4).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab4).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab4).args[1]).toBe(0xb)
  })

  test('16: Expect disassembler to match opcode 8xy5 to instruction SUB_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab5).instruction).toHaveProperty('id', 'SUB_VX_VY')
    expect(Disassembler.disassemble(0x8ab5).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab5).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab5).args[1]).toBe(0xb)
  })

  test('17: Expect disassembler to match opcode 8xy6 to instruction SHR_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab6).instruction).toHaveProperty('id', 'SHR_VX_VY')
    expect(Disassembler.disassemble(0x8ab6).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab6).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab6).args[1]).toBe(0xb)
  })

  test('18: Expect disassembler to match opcode 8xy7 to instruction SUBN_VX_VY', () => {
    expect(Disassembler.disassemble(0x8ab7).instruction).toHaveProperty('id', 'SUBN_VX_VY')
    expect(Disassembler.disassemble(0x8ab7).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8ab7).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8ab7).args[1]).toBe(0xb)
  })

  test('19: Expect disassembler to match opcode 8xyE to instruction SHL_VX_VY', () => {
    expect(Disassembler.disassemble(0x8abe).instruction).toHaveProperty('id', 'SHL_VX_VY')
    expect(Disassembler.disassemble(0x8abe).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x8abe).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x8abe).args[1]).toBe(0xb)
  })

  test('20: Expect disassembler to match opcode 9xy0 to instruction SNE_VX_VY', () => {
    expect(Disassembler.disassemble(0x9ab0).instruction).toHaveProperty('id', 'SNE_VX_VY')
    expect(Disassembler.disassemble(0x9ab0).args).toHaveLength(2)
    expect(Disassembler.disassemble(0x9ab0).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0x9ab0).args[1]).toBe(0xb)
  })

  test('21: Expect disassembler to match opcode Annn to instruction LD_I_ADDR', () => {
    expect(Disassembler.disassemble(0xa999).instruction).toHaveProperty('id', 'LD_I_ADDR')
    expect(Disassembler.disassemble(0xa999).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xa999).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xa999).args[1]).toBe(0x999)
  })

  test('22: Expect disassembler to match opcode Bnnn to instruction JP_V0_ADDR', () => {
    expect(Disassembler.disassemble(0xb400).instruction).toHaveProperty('id', 'JP_V0_ADDR')
    expect(Disassembler.disassemble(0xb400).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xb400).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xb400).args[1]).toBe(0x400)
  })

  test('23: Expect disassembler to match opcode Cxnn to instruction RND_VX_NN', () => {
    expect(Disassembler.disassemble(0xcabb).instruction).toHaveProperty('id', 'RND_VX_NN')
    expect(Disassembler.disassemble(0xcabb).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xcabb).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xcabb).args[1]).toBe(0xbb)
  })

  test('24: Expect disassembler to match opcode Dxyn to instruction DRW_VX_VY_N', () => {
    expect(Disassembler.disassemble(0xdab9).instruction).toHaveProperty('id', 'DRW_VX_VY_N')
    expect(Disassembler.disassemble(0xdab9).args).toHaveLength(3)
    expect(Disassembler.disassemble(0xdab9).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xdab9).args[1]).toBe(0xb)
    expect(Disassembler.disassemble(0xdab9).args[2]).toBe(0x9)
  })

  test('25: Expect disassembler to match opcode Ex9E to instruction SKP_VX', () => {
    expect(Disassembler.disassemble(0xea9e).instruction).toHaveProperty('id', 'SKP_VX')
    expect(Disassembler.disassemble(0xea9e).args).toHaveLength(1)
    expect(Disassembler.disassemble(0xea9e).args[0]).toBe(0xa)
  })

  test('26: Expect disassembler to match opcode ExA1 to instruction SKNP_VX', () => {
    expect(Disassembler.disassemble(0xeba1).instruction).toHaveProperty('id', 'SKNP_VX')
    expect(Disassembler.disassemble(0xeba1).args).toHaveLength(1)
    expect(Disassembler.disassemble(0xeba1).args[0]).toBe(0xb)
  })

  test('27: Expect disassembler to match opcode Fx07 to instruction LD_VX_DT', () => {
    expect(Disassembler.disassemble(0xfa07).instruction).toHaveProperty('id', 'LD_VX_DT')
    expect(Disassembler.disassemble(0xfa07).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa07).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xfa07).args[1]).toBe(0)
  })

  test('28: Expect disassembler to match opcode Fx0A to instruction LD_VX_N', () => {
    expect(Disassembler.disassemble(0xfb0a).instruction).toHaveProperty('id', 'LD_VX_N')
    expect(Disassembler.disassemble(0xfb0a).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfb0a).args[0]).toBe(0xb)
    expect(Disassembler.disassemble(0xfb0a).args[1]).toBe(0)
  })

  test('29: Expect disassembler to match opcode Fx15 to instruction LD_DT_VX', () => {
    expect(Disassembler.disassemble(0xfb15).instruction).toHaveProperty('id', 'LD_DT_VX')
    expect(Disassembler.disassemble(0xfb15).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfb15).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfb15).args[1]).toBe(0xb)
  })

  test('30: Expect disassembler to match opcode Fx18 to instruction LD_ST_VX', () => {
    expect(Disassembler.disassemble(0xfa18).instruction).toHaveProperty('id', 'LD_ST_VX')
    expect(Disassembler.disassemble(0xfa18).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa18).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa18).args[1]).toBe(0xa)
  })

  test('31: Expect disassembler to match opcode Fx1E to instruction ADD_I_VX', () => {
    expect(Disassembler.disassemble(0xfa1e).instruction).toHaveProperty('id', 'ADD_I_VX')
    expect(Disassembler.disassemble(0xfa1e).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa1e).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa1e).args[1]).toBe(0xa)
  })

  test('32: Expect disassembler to match opcode Fx29 to instruction LD_F_VX', () => {
    expect(Disassembler.disassemble(0xfa29).instruction).toHaveProperty('id', 'LD_F_VX')
    expect(Disassembler.disassemble(0xfa29).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa29).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa29).args[1]).toBe(0xa)
  })

  test('33: Expect disassembler to match opcode Fx33 to instruction LD_B_VX', () => {
    expect(Disassembler.disassemble(0xfa33).instruction).toHaveProperty('id', 'LD_B_VX')
    expect(Disassembler.disassemble(0xfa33).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa33).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa33).args[1]).toBe(0xa)
  })

  test('34: Expect disassembler to match opcode Fx55 to instruction LD_I_VX', () => {
    expect(Disassembler.disassemble(0xfa55).instruction).toHaveProperty('id', 'LD_I_VX')
    expect(Disassembler.disassemble(0xfa55).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa55).args[0]).toBe(0)
    expect(Disassembler.disassemble(0xfa55).args[1]).toBe(0xa)
  })

  test('35: Expect disassembler to match opcode Fx65 to instruction LD_VX_I', () => {
    expect(Disassembler.disassemble(0xfa65).instruction).toHaveProperty('id', 'LD_VX_I')
    expect(Disassembler.disassemble(0xfa65).args).toHaveLength(2)
    expect(Disassembler.disassemble(0xfa65).args[0]).toBe(0xa)
    expect(Disassembler.disassemble(0xfa65).args[1]).toBe(0)
  })

  test('36: Expect all other opcodes to match DW (Data Word)', () => {
    expect(Disassembler.disassemble(0x5154).instruction).toHaveProperty('id', 'DW')
    expect(Disassembler.disassemble(0x5154).args).toHaveLength(1)
    expect(Disassembler.disassemble(0x5154).args[0]).toBe(0x5154)
  })
})
