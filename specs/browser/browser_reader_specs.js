const chai = require('chai')
const expect = chai.expect;
let StreamableBuffers = require('../../lib/browser_reader.js')
let SIZE_OF_INT = 4

class FakeXMLHttpRequest {

}

describe('test', () => {
  let testXHR

  beforeEach(() =>
    testXHR = {
      setProgress(arraybuffer) {
        this.response = arraybuffer
        this.onprogress()
      }
    }
  )

  it('read a single value', (callback) => {
    const buffer = getBuffer([1,SIZE_OF_INT,3])

    new StreamableBuffers(testXHR).onData((buffer) => {
      const data = new DataView(buffer)
      expect(data.getUint32(0)).to.equal(3)
      callback()
    })

    testXHR.setProgress(buffer)
  })

  it('read two values', (callback) => {
    const buffer = getBuffer([2,SIZE_OF_INT,3, SIZE_OF_INT, 7])

    let elementsCount = 0

    new StreamableBuffers(testXHR).onData((buffer) => {
      const data = new DataView(buffer)

      switch(elementsCount) {
        case 0:
          expect(data.getUint32(0)).to.equal(3)
          break;
        case 1:
          expect(data.getUint32(0)).to.equal(7)
          callback()
          break;
      }

      elementsCount++
    })

    testXHR.setProgress(buffer)
  })

  it('read two values in two progress events', (callback) => {
    let elementsCount = 0

    new StreamableBuffers(testXHR).onData((buffer) => {
      const data = new DataView(buffer)

      switch(elementsCount) {
        case 0:
          expect(data.getUint32(0)).to.equal(3)
          break;
        case 1:
          expect(data.getUint32(0)).to.equal(7)
          callback()
          break;
      }

      elementsCount++
    })

    testXHR.setProgress(getBuffer([2,SIZE_OF_INT,3]))
    testXHR.setProgress(getBuffer([2,SIZE_OF_INT,3, SIZE_OF_INT, 7]))
  })

  it('handles partial value in response', (callback) => {
    let elementsCount = 0

    new StreamableBuffers(testXHR).onData((buffer) => {
      const data = new DataView(buffer)

      switch(elementsCount) {
        case 0:
          expect(data.getUint32(0)).to.equal(3)
          break;
        case 1:
          expect(data.getUint32(0)).to.equal(7)
          expect(data.getUint32(SIZE_OF_INT)).to.equal(9)
          callback()
          break;
      }

      elementsCount++
    })

    testXHR.setProgress(getBuffer([2,SIZE_OF_INT,3, 2 * SIZE_OF_INT, 7]))
    testXHR.setProgress(getBuffer([2,SIZE_OF_INT,3, 2 * SIZE_OF_INT, 7, 9]))
  })
})

function getBuffer(uint32array) {
  const buffer = new ArrayBuffer(uint32array.length * SIZE_OF_INT)
  const data = new DataView(buffer)

  uint32array.forEach((uint, i) => data.setUint32(i * SIZE_OF_INT, uint))

  return buffer
}
