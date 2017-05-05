const Writer = require('./writer.js')
const Reader = require('./reader.js')

module.exports = {
  createWriter(targetWriteable) {
    return new Writer(targetWriteable)
  },

  getReaderStream() {
    return new Reader()
  }
}
