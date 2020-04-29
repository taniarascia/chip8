# Chip8.js

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![chip8js on NPM](https://img.shields.io/npm/v/chip8js.svg?color=green&label=chip8js)](https://www.npmjs.com/package/chip8js) [![Build Status](https://travis-ci.org/taniarascia/chip8.svg?branch=master)](https://travis-ci.org/taniarascia/chip8) [![Coverage Status](https://coveralls.io/repos/github/taniarascia/chip8/badge.svg?branch=master&service=github)](https://coveralls.io/github/taniarascia/chip8?branch=master)

A Chip-8 emulator written in JavaScript.

> [Chip-8](https://en.wikipedia.org/wiki/CHIP-8) is a simple, interpreted, programming language which was first used on some do-it-yourself computer systems in the late 1970s and early 1980s.

### [View the demo](https://taniarascia.github.io/chip8/) | [Read the article](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Web](#web)
  - [Terminal](#terminal)
  - [Native](#native)
- [Motivation](#motivation)
- [Testing](#testing)
  - [Instruction tests](#instruction-tests)
  - [CPU tests](#cpu-tests)
- [Acknowlegdements](#acknowledgements)
- [License](#license)

## Installation

> This guide assumes you already have [Node.js](https://nodejs.org/en/) and npm installed.

Prior to installing Chip8.js, you must have CMake installed.

```bash
brew install cmake
```

Clone the repository and install.

```bash
git clone git@github.com:taniarascia/chip8.git
cd chip8
npm i
```

## Usage

Chip8.js can be run on the web, in a terminal, or using native keybindings.

### Web

- [Chip8.js emulator for the web](https://taniarascia.github.io/chip8/)

#### Development

Spin up a local server during development.

```bash
# watch for changes and rebuild
npm run watch:web

# spin up server on localhost:8080
cd web && http-server 
```

#### Deployment

Build and bundle the code for the web.

```bash
npm run build:web
```

Deploy to GitHub.

```bash
# remove web/bundle.js from .gitignore
git add web && git commit -m "update web version"

# delete gh-pages branch from origin before push
git subtree push --prefix web origin gh-pages
```

### Terminal

Run Chip8.js in the terminal by selecting a ROM.

```bash
npm run play:terminal roms/<ROM>
```

### Native

Run Chip8.js natively with [raylib](https://www.npmjs.com/package/raylib) (experimental).

```bash
npm run play:native roms/<ROM>
```

## Motivation

Chip8.js is a project to write a Chip-8 emulator in JavaScript. The main motivation is to learn lower level programming concepts and to increase familiarity with the Node.js environment.

Here are some of the concepts I learned while writing this program:

- The base system: specifically base 2 (binary), base 10 (decimal), base 16 (hexadecimal), how they interact with each other and the concept of abstract numbers in programming
- Bits, nibbles, bytes, ASCII encoding, and big and little endian values
- Bitwise operators - AND (`&`), OR (`|`), XOR (`^`), left shift (`<<`), right shift (`>>`) and how to use them for masking, setting, and testing values
- Using the Node built-in file system ([fs](https://www.npmjs.com/package/fs))
- The concept of a raw data buffer and how to work with it, how to convert an 8-bit buffer to a 16-bit big endian array
- Writing and understanding a 8-bit and 16-bit hex dump
- How to disassemble and decode an opcode into instructions a CPU can use
- How a CPU can utilize memory, stack, program counters, stack pointers, memory addresses, and registers
- How a CPU implements fetch, decode, and execute

And here are some articles I wrote based on those concepts:

- [Understanding Bits, Bytes, Bases, and Writing a Hex Dump in JavaScript (Node)](https://www.taniarascia.com/bits-bytes-bases-and-a-hex-dump-javascript/)
- [Writing an Emulator in JavaScript (with Multiple UIs)](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/)

## Testing

The unit tests for Chip8.js use the Jest testing framework. You can run all test suites with or without displaying coverage.

```bash
# Run test suites
npm run test

# Run test suites and view coverage
npm run test --coverage
```

Chip8.js has two suites of unit tests:

- Opcode instruction masks and arguments
- CPU implementation of instructions

### Instruction tests

The [instruction tests](tests/instructions.test.js) cover the `INSTRUCTION_SET` found in `data/instructionSet.js`. Each instruction has:

- A `key`: for internal use
- An `id`: for a unique name
- A `name`: for the type of instruction)
- A `mask`: to filter out arguments from instruction signifiers)
- A `pattern`: to match the mask to the specific instruction pattern
- `arguments`, each of which contain:
  - A `mask`: to filter the nibble(s) to arguments
  - A `shift`: to shift it by location
  - A `type`: to signify the type of argument

```js
// data/instructionSet.js

{
  key: 6,
  id: 'SE_VX_NN',
  name: 'SE',
  mask: 0xf000,
  pattern: 0x3000,
  arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }, { mask: 0x00ff, shift: 0, type: 'NN' }],
}
```

Each unit test checks an opcode to an instruction and tests:

- The unique `id` to ensure the correct instruction is running for the mask/pattern
- The number of arguments
- The value of the arguments

```js
// tests/instructions.test.js

test('6: Expect disassembler to match opcode 3xnn to instruction SE_VX_NN', () => {
  expect(Disassembler.disassemble(0x3abb).instruction).toHaveProperty('id', 'SE_VX_NN')
  expect(Disassembler.disassemble(0x3abb).args).toHaveLength(2)
  expect(Disassembler.disassemble(0x3abb).args[0]).toBe(0xa)
  expect(Disassembler.disassemble(0x3abb).args[1]).toBe(0xbb)
})
```

There are 35 instruction tests for 35 opcodes (the first instruction, `CLS`, is no longer implemented).

### CPU tests

The CPU decodes the opcode and returns the instruction object from `data/instructionSet.js`. Each instruction performs a specific, unique action in the `case`. The [CPU tests](tests/cpu.test.js) test the state of the CPU after an executing an instruction.

In the below example, the instruction is skipping an instruction if `Vx === nn`, otherwise it's going to the next instruction as usual.

```js
// classes/CPU.js

case 'SE_VX_NN':
  // Skip next instruction if Vx = nn.
  if (this.registers[args[0]] === args[1]) {
    this._skipInstruction()
  } else {
    this._nextInstruction()
  }
  break
```

Each CPU test:

- Loads a `RomBuffer` containing the data of a single opcode
- Sets up the state to make the instruction testable (if necessary)
- Executes the `step` method
- Tests all possible outcomes of an instruction and state updates

In this example, the instruction can either be skipped or not skipped depending on the arguments, and both cases are tested.

```js
// tests/cpu.test.js

test('6: SE_VX_NN (3xnn) - Program counter should increment by two bytes if register x is not equal to nn argument', () => {
  cpu.load({ data: [0x3abb] })
  cpu.step()

  expect(cpu.PC).toBe(0x202)
})

test('6: SE_VX_NN (3xnn) - Program counter should increment by four bytes if register x is equal to nn argument', () => {
  cpu.load({ data: [0x3abb] })
  cpu.registers[0xa] = 0xbb

  cpu.step()

  expect(cpu.PC).toBe(0x204)
})
```

## Acknowledgements

- Inspiration, guidance, and mentorship from [Vanya Sergeev](https://sergeev.io).
- [Cowgod's Chip-8 Technical Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#8xy3), made by Thomas P. Greene.
- [CHIP-8 - Wikipedia](https://en.wikipedia.org/wiki/CHIP-8).

## Author

- [Tania Rascia](https://www.taniarascia.com)

## License

This project is open source and available under the [MIT License](LICENSE).
