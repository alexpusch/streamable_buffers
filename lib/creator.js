const fs = require('fs')
const bluebird = require('bluebird')
const Writeable = require('stream').Writeable
const Readable = require('stream').Readable

const SIZE_OF_INT = 4

class StreamableBufferStream extends Readable{
  constructor(length){
    super({})

    this._writeUInt32(length)
  }

  _read() {

  }

  add(buffer) {
    this._writeUInt32(buffer.length)
    this.push(buffer)
  }

  done() {
    this.push(null)
  }

  _writeUInt32(int) {
    let buffer = Buffer.alloc(SIZE_OF_INT)
    buffer.writeUInt32BE(int)
    this.push(buffer)
  }
}

module.exports = StreamableBufferStream
