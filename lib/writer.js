const fs = require('fs')
const bluebird = require('bluebird')
const Writeable = require('stream').Writeable
const Readable = require('stream').Readable

const SIZE_OF_INT = 4

module.exports = class Writer{
  constructor(targetWriteable){
    this.targetWriteable = targetWriteable
  }

  write(buffer){
    this._writeUInt32(buffer.length)
    this.targetWriteable.write(buffer)
  }

  _writeUInt32(int) {
    let buffer = Buffer.alloc(SIZE_OF_INT)
    buffer.writeUInt32BE(int)

    this.targetWriteable.write(buffer)
  }
}
