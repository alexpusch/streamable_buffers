const fs = require('fs')
const bluebird = require('bluebird')
const Readable = require('stream').Readable

const Duplex = require('stream').Duplex

const SIZE_OF_INT = 4

class StreamableBufferReader extends Duplex {
  constructor(options){
    super(options)
  }

  _read(size) {
  }

  _write(chunk, encoding, callback) {
    let posInChunk = 0

    if(!this.totalElements){
      this.totalElements = chunk.readUInt32BE(0)
      posInChunk += SIZE_OF_INT
    }

    // handle leftover - the part of the last chunk that is the first part of next elements
    if(this.leftoverChunk) {
      const hasAllLeftoverChunk = this.leftoverChunk.length + chunk.length >= this.leftoverElementSize

      if(hasAllLeftoverChunk) {
        let buffer = Buffer.concat([this.leftoverChunk, chunk])
        posInChunk = this.leftoverElementSize - this.leftoverChunk.length

        this.leftoverElementSize = undefined
        this.leftoverChunk = undefined

        this.push(buffer)
      } else {
        const newLeftoverChunk = Buffer.concat([this.leftoverChunk, chunk])
        this.leftoverChunk = newLeftoverChunk
        posInChunk = chunk.length
      }
    }

    // loop over all elements in current chunk
    // TODO: if the chunk splits elements size bytes this will fail
    while(chunk.length - posInChunk >= SIZE_OF_INT){
      const elementSize = chunk.readUInt32BE(posInChunk)
      posInChunk += SIZE_OF_INT;

      if(chunk.length - posInChunk >= elementSize){
        const buffer = Buffer.alloc(elementSize)
        chunk.copy(buffer, 0, posInChunk, posInChunk + elementSize)

        this.push(buffer)
        this.currentElement++;
        posInChunk+= elementSize

      } else {
        this.leftoverElementSize = elementSize
        this.leftoverChunk = Buffer.alloc(chunk.length - posInChunk)
        chunk.copy(this.leftoverChunk, 0, posInChunk, chunk.length)
        posInChunk = chunk.length
      }
    }

    callback()
  }
}

module.exports = StreamableBufferReader
