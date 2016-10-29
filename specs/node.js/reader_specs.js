const chai = require('chai')
const expect = chai.expect;
const Readable = require('stream').Readable

const StreamableBuffer = require('../../lib')
let SIZE_OF_INT = 4

class HelperStream extends Readable {
  writeUintArray(uintArray) {
    const buffer = Buffer.alloc(uintArray.length * SIZE_OF_INT)

    uintArray.forEach((int, i) => {
      buffer.writeUInt32BE(int, i * SIZE_OF_INT)
    })

    this.push(buffer)
  }

  _read() {}
}

describe('reader', () => {
  let testStream

  beforeEach(() => {
    testStream = new HelperStream()
  })

  it("reads a single element", (callback) => {
    let stream = testStream.pipe(StreamableBuffer.getReaderStream())

    stream.on('data', (buffer) => {
      expect(buffer.length).to.equal(SIZE_OF_INT)
      expect(buffer.readUInt32BE(0)).to.equal(3)
      callback()
    })

    testStream.writeUintArray([1, SIZE_OF_INT, 3])
  })


  it("reads a two elements in the same read", (callback) => {
    let stream = testStream.pipe(StreamableBuffer.getReaderStream())

    let elementsCount = 0
    stream.on('data', (buffer) => {
      switch(elementsCount){
        case 0:
         expect(buffer.readUInt32BE(0)).to.equal(3)
         break;

        case 1:
          expect(buffer.readUInt32BE(0)).to.equal(5)
          callback()
          break;
      }

      elementsCount++
    })

    testStream.writeUintArray([2, SIZE_OF_INT, 3, SIZE_OF_INT, 5])
  })

  it("reads a two elements in two read", (callback) => {
    let stream = testStream.pipe(StreamableBuffer.getReaderStream())

    let elementsCount = 0
    stream.on('data', (buffer) => {
      switch(elementsCount){
        case 0:
          expect(buffer.readUInt32BE(0)).to.equal(3)
          break
        case 1:
          expect(buffer.readUInt32BE(0)).to.equal(5)
          callback()
          break

      }

      elementsCount++
    })

    testStream.writeUintArray([2, SIZE_OF_INT, 3])
    testStream.writeUintArray([SIZE_OF_INT, 5])
  })

  it('handles variant size buffers', (callback) => {
    let stream = testStream.pipe(StreamableBuffer.getReaderStream())

    let elementsCount = 0
    stream.on('data', (buffer) => {
      switch(elementsCount){
        case 0:
          expect(buffer.readUInt32BE(0)).to.equal(3)
          break
        case 1:
          expect(buffer.readUInt32BE(0)).to.equal(7)
          expect(buffer.readUInt32BE(SIZE_OF_INT)).to.equal(5)
          callback()
          break
      }

      elementsCount++
    })

    testStream.writeUintArray([2, SIZE_OF_INT, 3, SIZE_OF_INT * 2, 7, 5 ])
  })

  it('handles leftover', (callback) => {
    let stream = testStream.pipe(StreamableBuffer.getReaderStream())

    let elementsCount = 0
    stream.on('data', (buffer) => {
      switch(elementsCount) {
        case 0:
          expect(buffer.readUInt32BE(0)).to.equal(3)
          break
        case 1:
          expect(buffer.readUInt32BE(0)).to.equal(7)
          expect(buffer.readUInt32BE(SIZE_OF_INT)).to.equal(5)
          callback()
          break
      }

      elementsCount++
    })

    testStream.writeUintArray([2, SIZE_OF_INT, 3, SIZE_OF_INT * 2, 7])
    testStream.writeUintArray([5])
  })

  it('handles leftover over several chunks', (callback) => {
    let stream = testStream.pipe(StreamableBuffer.getReaderStream())

    let elementsCount = 0
    stream.on('data', (buffer) => {
      switch(elementsCount) {
        case 0:
          expect(buffer.readUInt32BE(0)).to.equal(3)
          break
        case 1:
          expect(buffer.readUInt32BE(0)).to.equal(7)
          expect(buffer.readUInt32BE(SIZE_OF_INT)).to.equal(5)
          expect(buffer.readUInt32BE(2 * SIZE_OF_INT)).to.equal(9)
          callback()
          break
      }

      elementsCount++
    })

    testStream.writeUintArray([2, SIZE_OF_INT, 3, SIZE_OF_INT * 3, 7])
    testStream.writeUintArray([5])
    testStream.writeUintArray([9])
  })
})

