const chai = require('chai')
const expect = chai.expect;
const Readable = require('stream').Readable
var concat = require('concat-stream')

const StreamableBufferWriter = require('../lib/writer.js')

const SIZE_OF_INT = 4

describe('StreamableBufferWriter', () => {
  it('writes the number of elements in the first int of the stream', (callback) => {
    const stream = new StreamableBufferWriter(1)

    const buffer = Buffer.alloc(SIZE_OF_INT)
    buffer.writeUInt32BE(1)

    stream.pipe(concat((output) => {
      expect(output.readUInt32BE(0)).to.equal(1)
      callback()
    }))

    stream.add(buffer)
    stream.done()
  })

  it('writes the size of the first element', (callback) => {
    const stream = new StreamableBufferWriter(1)
    const buffer = createUintBuffer([1])

    stream.pipe(concat((output) => {
      expect(output.readUInt32BE(SIZE_OF_INT)).to.equal(SIZE_OF_INT)
      callback()
    }))

    stream.add(buffer)
    stream.done()
  })

  it('writes the first element', (callback) => {
    const stream = new StreamableBufferWriter(1)
    const buffer = createUintBuffer([1])

    stream.pipe(concat((output) => {
      expect(output.readUInt32BE(2 * SIZE_OF_INT)).to.equal(1)
      callback()
    }))

    stream.add(buffer)
    stream.done()
  })

  it('can write several elements', (callback) => {
    const stream = new StreamableBufferWriter(3)

    const buffer1 = createUintBuffer([1])
    const buffer2 = createUintBuffer([2])
    const buffer3 = createUintBuffer([3])

    stream.pipe(concat((output) => {
      expect(output).to.deep.equal(createUintBuffer([3, SIZE_OF_INT, 1, SIZE_OF_INT, 2, SIZE_OF_INT, 3]))
      callback()
    }))

    stream.add(buffer1)
    stream.add(buffer2)
    stream.add(buffer3)
    stream.done()
  })
})

function createUintBuffer(uintArray) {
  let buffer = Buffer.alloc(uintArray.length * SIZE_OF_INT)

  uintArray.forEach((uint, i) => buffer.writeUInt32BE(uint, i * SIZE_OF_INT))

  return buffer
}
