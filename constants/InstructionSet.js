const INSTRUCTION_SET = [
  {
    key: 2,
    name: 'CLS',
    mask: 0xffff,
    pattern: 0x00e0,
    arguments: [],
  },
  {
    key: 3,
    name: 'RET',
    mask: 0xffff,
    pattern: 0x00ee,
    arguments: [],
  },
  {
    key: 4,
    name: 'JP',
    mask: 0xf000,
    pattern: 0x1000,
    arguments: [ { mask: 0x0fff, shift: 0, type: 'Address' } ],
  },
  {
    key: 5,
    name: 'CALL',
    mask: 0xf000,
    pattern: 0x2000,
    arguments: [ { mask: 0x0fff, shift: 0, type: 'Address' } ],
  },
  {
    key: 6,
    name: 'SE',
    mask: 0xf000,
    pattern: 0x3000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Constant' },
    ],
  },
  {
    key: 7,
    name: 'SNE',
    mask: 0xf000,
    pattern: 0x4000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Constant' },
    ],
  },
  {
    key: 8,
    name: 'SE',
    mask: 0xf00f,
    pattern: 0x5000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 9,
    name: 'LD',
    mask: 0xf000,
    pattern: 0x6000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Constant' },
    ],
  },
  {
    key: 10,
    name: 'ADD',
    mask: 0xf000,
    pattern: 0x7000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Constant' },
    ],
  },
  {
    key: 11,
    name: 'LD',
    mask: 0xf00f,
    pattern: 0x8000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 12,
    name: 'OR',
    mask: 0xf00f,
    pattern: 0x8001,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 13,
    name: 'AND',
    mask: 0xf00f,
    pattern: 0x8002,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 14,
    name: 'XOR',
    mask: 0xf00f,
    pattern: 0x8003,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 15,
    name: 'ADD',
    mask: 0xf00f,
    pattern: 0x8004,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 16,
    name: 'SUB',
    mask: 0xf00f,
    pattern: 0x8005,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 17,
    name: 'SHR',
    mask: 0xf00f,
    pattern: 0x8006,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 18,
    name: 'SUBN',
    mask: 0xf00f,
    pattern: 0x8007,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 19,
    name: 'SHL',
    mask: 0xf00f,
    pattern: 0x800e,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 20,
    name: 'SNE',
    mask: 0xf00f,
    pattern: 0x9000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
    ],
  },
  {
    key: 21,
    name: 'LD',
    mask: 0xf000,
    pattern: 0xa000,
    arguments: [ { mask: 0x0000, shift: 0, type: 'I' } ],
  },
  {
    key: 22,
    name: 'JP',
    mask: 0xf000,
    pattern: 0xb000,
    arguments: [ { mask: 0x0fff, shift: 0, type: 'Address' } ],
  },
  {
    key: 23,
    name: 'RND',
    mask: 0xf000,
    pattern: 0xc000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Constant' },
    ],
  },
  {
    key: 24,
    name: 'DRW',
    mask: 0xf000,
    pattern: 0xd000,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00f0, shift: 4, type: 'Register' },
      { mask: 0x000f, shift: 0, type: 'Constant' },
    ],
  },
  {
    key: 25,
    name: 'SKP',
    mask: 0xf0ff,
    pattern: 0xe09e,
    arguments: [ { mask: 0x0f00, shift: 8, type: 'Register' } ],
  },
  {
    key: 26,
    name: 'SKNP',
    mask: 0xf0ff,
    pattern: 0xe0a1,
    arguments: [ { mask: 0x0f00, shift: 8, type: 'Register' } ],
  },
  {
    key: 27,
    name: 'LD',
    mask: 0xf00f,
    pattern: 0xf007,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Delay Timer' },
    ],
  },
  {
    key: 28,
    name: 'LD',
    mask: 0xf00f,
    pattern: 0xf00a,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Key' },
    ],
  },
  {
    key: 29,
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf015,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Delay Timer' },
    ],
  },
  {
    key: 30,
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf018,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Sound Timer' },
    ],
  },
  {
    key: 31,
    name: 'ADD',
    mask: 0xf0ff,
    pattern: 0xf01e,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'Sound Timer' },
    ],
  },
  {
    key: 32,
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf029,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'I' },
    ],
  },
  {
    key: 33,
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf033,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'I' },
    ],
  },
  {
    key: 34,
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf055,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'I' },
    ],
  },
  {
    key: 35,
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf065,
    arguments: [
      { mask: 0x0f00, shift: 8, type: 'Register' },
      { mask: 0x00ff, shift: 0, type: 'I' },
    ],
  },
]

module.exports = {
  INSTRUCTION_SET,
}
