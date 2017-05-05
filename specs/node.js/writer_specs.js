const chai = require('chai')
const expect = chai.expect;
const Readable = require('stream').Readable
var concat = require('concat-stream')
const streamBuffers = require('stream-buffers');
const StreamableBuffers = require('../../lib')
const SIZE_OF_INT = 4

describe('StreamableBufferWriter', () => {
  let target, writer

  beforeEach(() => {
    target = new streamBuffers.WritableStreamBuffer()
    writer = StreamableBuffers.createWriter(target)
  })

  it('writes the size of the first element', () => {
    const buffer = createUintBuffer([1])
    writer.write(buffer)

    expect(target.getContents().readUInt32BE(0)).to.equal(SIZE_OF_INT)
  })

  it('writes the first element', () => {
    const buffer = createUintBuffer([1])
    writer.write(buffer)

    expect(target.getContents().readUInt32BE(SIZE_OF_INT, SIZE_OF_INT)).to.equal(1)
  })

  it('can write several elements', () => {
    const buffer1 = createUintBuffer([1])
    const buffer2 = createUintBuffer([2])
    const buffer3 = createUintBuffer([3])

    writer.write(buffer1)
    writer.write(buffer2)
    writer.write(buffer3)

    const expected = createUintBuffer([SIZE_OF_INT, 1, SIZE_OF_INT, 2, SIZE_OF_INT, 3])
    expect(target.getContents()).to.deep.equal(expected)
  })
})

function createUintBuffer(uintArray) {
  let buffer = Buffer.alloc(uintArray.length * SIZE_OF_INT)

  uintArray.forEach((uint, i) => buffer.writeUInt32BE(uint, i * SIZE_OF_INT))

  return buffer
}
