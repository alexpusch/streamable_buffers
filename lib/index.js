const Creator = require('./creator.js')
const Reader = require('./reader.js')

module.exports = {
  getCreatorStream(size) {
    return new Creator(size)
  },

  getReaderStream() {
    return new Reader()
  }
}
